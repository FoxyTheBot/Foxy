package net.cakeyfox.foxy

import dev.arbjerg.lavalink.client.LavalinkClient
import dev.arbjerg.lavalink.client.loadbalancing.builtin.VoiceRegionPenaltyProvider
import dev.arbjerg.lavalink.libraries.jda.JDAVoiceUpdateListener
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.cancel
import kotlinx.datetime.TimeZone
import kotlinx.serialization.json.Json
import mu.KotlinLogging
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.showtime.ShowtimeClient
import net.cakeyfox.foxy.interactions.FoxyCommandManager
import net.cakeyfox.foxy.interactions.components.FoxyComponentManager
import net.cakeyfox.foxy.listeners.GuildListener
import net.cakeyfox.foxy.listeners.InteractionsListener
import net.cakeyfox.foxy.listeners.MessageListener
import net.cakeyfox.serializable.data.utils.FoxyConfig
import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.foxy.database.core.DatabaseClient
import net.cakeyfox.foxy.utils.music.GuildMusicManager
import net.cakeyfox.foxy.utils.threads.ThreadPoolManager
import net.cakeyfox.foxy.utils.threads.ThreadUtils
import net.cakeyfox.foxy.leaderboard.LeaderboardManager
import net.cakeyfox.foxy.internal.FoxyInternalAPI
import net.cakeyfox.foxy.listeners.lavalink.LavalinkMajorListener
import net.cakeyfox.foxy.utils.LavalinkUtils.registerNode
import net.cakeyfox.foxy.utils.TasksUtils
import net.cakeyfox.foxy.utils.youtube.YouTubeManager
import net.cakeyfox.foxy.website.FoxyWebsite
import net.dv8tion.jda.api.JDAInfo
import net.dv8tion.jda.api.OnlineStatus
import net.dv8tion.jda.api.entities.Activity
import net.dv8tion.jda.api.requests.GatewayIntent
import net.dv8tion.jda.api.requests.RestConfig
import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder
import net.dv8tion.jda.api.sharding.ShardManager
import net.dv8tion.jda.api.utils.ChunkingFilter
import net.dv8tion.jda.api.utils.MemberCachePolicy
import net.dv8tion.jda.api.utils.cache.CacheFlag
import java.util.concurrent.TimeUnit
import kotlin.concurrent.thread

class FoxyInstance(
    val config: FoxyConfig,
    val currentCluster: FoxyConfig.DiscordSettings.Cluster
) {
    lateinit var shardManager: ShardManager
    lateinit var showtimeClient: ShowtimeClient
    lateinit var utils: FoxyUtils
    lateinit var interactionManager: FoxyComponentManager
    private lateinit var foxyInternalAPI: FoxyInternalAPI
    private val activeJobs = ThreadUtils.activeJobs
    private val coroutineExecutor = ThreadUtils.createThreadPool("CoroutineExecutor [%d]")

    val json = Json {
        encodeDefaults = true
        ignoreUnknownKeys = true
    }

    val environment = config.environment
    val restVersion = JDAInfo.DISCORD_REST_VERSION
    val baseUrl = config.discord.baseUrl
    val logger = KotlinLogging.logger { }
    val threadPoolManager = ThreadPoolManager()
    val coroutineDispatcher = coroutineExecutor.asCoroutineDispatcher()
    val foxyZone = TimeZone.currentSystemDefault()
    val tasksScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    val leaderboardManager: LeaderboardManager by lazy { LeaderboardManager(this) }
    val youtubeManager: YouTubeManager by lazy { YouTubeManager(this) }
    val locale = FoxyLocale("br")
    val database = DatabaseClient()
        .setPassword(config.database.password)
        .setUser(config.database.user)
        .setDatabase(config.database.databaseName)
        .setAddress(config.database.address)
        .setTimeout(config.database.requestTimeout, TimeUnit.SECONDS)
        .setProtocol(config.database.protocol)
        .also {
            it.connect()
        }

    val commandHandler: FoxyCommandManager by lazy { FoxyCommandManager(this) }
    val lavalink = LavalinkClient(config.discord.applicationId)
    val musicManagers = mutableMapOf<Long, GuildMusicManager>()

    val http: HttpClient by lazy {
        HttpClient(CIO) {
            install(HttpTimeout) { requestTimeoutMillis = 60_000 }
            install(ContentNegotiation) { json() }
        }
    }

    suspend fun start() {
        lavalink.loadBalancer.addPenaltyProvider(VoiceRegionPenaltyProvider())
        utils = FoxyUtils(this)
        interactionManager = FoxyComponentManager(this)
        showtimeClient = ShowtimeClient(config, config.showtime.key)
        foxyInternalAPI = FoxyInternalAPI(this)

        shardManager = DefaultShardManagerBuilder.create(
            GatewayIntent.GUILD_MEMBERS,
            GatewayIntent.MESSAGE_CONTENT,
            GatewayIntent.GUILD_MESSAGES,
            GatewayIntent.SCHEDULED_EVENTS,
            GatewayIntent.GUILD_EXPRESSIONS,
            GatewayIntent.DIRECT_MESSAGES,
            GatewayIntent.GUILD_VOICE_STATES,
            GatewayIntent.GUILD_MODERATION,
            GatewayIntent.AUTO_MODERATION_EXECUTION,
            GatewayIntent.AUTO_MODERATION_CONFIGURATION
        ).apply {
            if (baseUrl != null) {
                logger.info { "Using Discord base URL: $baseUrl" }

                setRestConfig(RestConfig().setBaseUrl("${baseUrl.removeSuffix("/")}/api/v$restVersion/"))
            }
        }
            .addEventListeners(
                GuildListener(this),
                InteractionsListener(this),
                MessageListener(this),
                LavalinkMajorListener(lavalink, this)
            )
            .setVoiceDispatchInterceptor(JDAVoiceUpdateListener((lavalink)))
            .setAutoReconnect(true)
            .setStatus(OnlineStatus.fromKey(database.bot.getBotSettings().status))
            .setActivity(Activity.playing("💫 Hold on! I'm starting :3c"))
            .setShardsTotal(config.discord.totalShards)
            .setShards(currentCluster.minShard, currentCluster.maxShard)
            .setMemberCachePolicy(MemberCachePolicy.ALL)
            .setChunkingFilter(ChunkingFilter.NONE)
            .disableCache(CacheFlag.entries)
            .enableCache(
                CacheFlag.EMOJI,
                CacheFlag.STICKER,
                CacheFlag.MEMBER_OVERRIDES,
                CacheFlag.VOICE_STATE
            )
            .setToken(config.discord.token)
            .setEnableShutdownHook(false)
            .build()


        registerNode(this)

        if (currentCluster.isMasterCluster) {
            TasksUtils.launchTasks(this)
           if (config.environment == "development") {
               FoxyWebsite(this, config)
           }
        }

        this.commandHandler.handle()

        Runtime.getRuntime().addShutdownHook(thread(false) {
            try {
                logger.info { "Foxy is shutting down..." }
                shardManager.shards.forEach { shard ->
                    shard.removeEventListener(*shard.registeredListeners.toTypedArray())
                    logger.info { "Shutting down shard #${shard.shardInfo.shardId}..." }
                    shard.shutdown()
                }
                http.close()
                database.close()
                foxyInternalAPI.stop()

                activeJobs.forEach {
                    logger.info { "Cancelling job $it" }
                    it.cancel()
                }

                coroutineExecutor.shutdown()
                threadPoolManager.shutdown()
                tasksScope.cancel()
            } catch (e: Exception) {
                logger.error(e) { "Error during shutdown process" }
            }
        })
    }
}