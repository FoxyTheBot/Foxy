package net.cakeyfox.foxy

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.artistry.ArtistryClient
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.command.FoxyCommandManager
import net.cakeyfox.foxy.command.component.FoxyComponentManager
import net.cakeyfox.foxy.listeners.GuildListener
import net.cakeyfox.foxy.listeners.InteractionsListener
import net.cakeyfox.foxy.listeners.MessageListener
import net.cakeyfox.foxy.utils.FoxyCacheManager
import net.cakeyfox.serializable.database.utils.FoxyConfig
import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.foxy.utils.analytics.TopggStatsSender
import net.cakeyfox.foxy.utils.api.FoxyInternalAPI
import net.cakeyfox.foxy.utils.database.DatabaseClient
import net.cakeyfox.foxy.utils.threads.ThreadPoolManager
import net.cakeyfox.foxy.utils.threads.ThreadUtils
import net.dv8tion.jda.api.OnlineStatus
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.requests.GatewayIntent
import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder
import net.dv8tion.jda.api.sharding.ShardManager
import net.dv8tion.jda.api.utils.ChunkingFilter
import net.dv8tion.jda.api.utils.MemberCachePolicy
import net.dv8tion.jda.api.utils.cache.CacheFlag
import kotlin.concurrent.thread

class FoxyInstance(
    val config: FoxyConfig,
    val currentCluster: FoxyConfig.Cluster
) {
    lateinit var shardManager: ShardManager
    lateinit var database: DatabaseClient
    lateinit var commandHandler: FoxyCommandManager
    lateinit var artistryClient: ArtistryClient
    lateinit var utils: FoxyUtils
    lateinit var interactionManager: FoxyComponentManager
    lateinit var httpClient: HttpClient
    lateinit var cacheManager: FoxyCacheManager
    lateinit var selfUser: User

    private lateinit var foxyInternalAPI: FoxyInternalAPI
    private lateinit var topggStatsSender: TopggStatsSender
    private lateinit var environment: String

    private val activeJobs = ThreadUtils.activeJobs
    private val currentClusterName = if (config.discord.clusters.size < 2) null else currentCluster.name
    private val coroutineExecutor = ThreadUtils.createThreadPool("CoroutineExecutor [%d]")

    val json = Json { ignoreUnknownKeys = true }
    val threadPoolManager = ThreadPoolManager()
    val coroutineDispatcher = coroutineExecutor.asCoroutineDispatcher()

    suspend fun start() {
        val logger = KotlinLogging.logger { }

        environment = config.environment
        database = DatabaseClient(this)
        commandHandler = FoxyCommandManager(this)
        utils = FoxyUtils(this)
        interactionManager = FoxyComponentManager(this)
        artistryClient = ArtistryClient(config, config.others.artistry.key)
        httpClient = HttpClient(CIO) {
            install(HttpTimeout) { requestTimeoutMillis = 60_000 }
            install(ContentNegotiation) { json() }
        }

        database.start(this)
        shardManager = DefaultShardManagerBuilder.create(
            GatewayIntent.GUILD_MEMBERS,
            GatewayIntent.MESSAGE_CONTENT,
            GatewayIntent.GUILD_MESSAGES,
            GatewayIntent.SCHEDULED_EVENTS,
            GatewayIntent.GUILD_EXPRESSIONS
        ).addEventListeners(
            GuildListener(this),
            InteractionsListener(this),
            MessageListener(this)
        )
            .setAutoReconnect(true)
            .setStatus(
                OnlineStatus.fromKey(database.bot.getBotSettings().status)
            )
            .setActivity(
                Activity.customStatus(
                    Constants.getDefaultActivity(
                        database.bot.getActivity(),
                        config.environment,
                        currentClusterName
                    )
                )
            )
            .setShardsTotal(config.discord.totalShards)
            .setShards(currentCluster.minShard, currentCluster.maxShard)
            .setMemberCachePolicy(MemberCachePolicy.ALL)
            .setChunkingFilter(ChunkingFilter.NONE)
            .disableCache(CacheFlag.entries)
            .enableCache(
                CacheFlag.EMOJI,
                CacheFlag.STICKER,
                CacheFlag.MEMBER_OVERRIDES,
            )
            .setToken(config.discord.token)
            .setEnableShutdownHook(false)
            .build()

        this.commandHandler.handle()

        selfUser = shardManager.shards.first().selfUser
        topggStatsSender = TopggStatsSender(this)
        foxyInternalAPI = FoxyInternalAPI(this)
        cacheManager = FoxyCacheManager(this)
        cacheManager.loadCakesLeaderboard()

        Runtime.getRuntime().addShutdownHook(thread(false) {
            try {
                logger.info { "Foxy is shutting down..." }
                shardManager.shards.forEach { shard ->
                    shard.removeEventListener(*shard.registeredListeners.toTypedArray())
                    logger.info { "Shutting down shard #${shard.shardInfo.shardId}..." }
                    shard.shutdown()
                }
                httpClient.close()
                database.close()
                foxyInternalAPI.stop()

                activeJobs.forEach {
                    logger.info { "Cancelling job $it" }
                    it.cancel()
                }
            } catch (e: Exception) {
                logger.error(e) { "Error during shutdown process" }
            }
        })
    }
}