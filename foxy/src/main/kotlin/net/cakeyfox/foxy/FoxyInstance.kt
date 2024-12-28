package net.cakeyfox.foxy

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import mu.KotlinLogging
import net.cakeyfox.artistry.ArtistryClient
import net.cakeyfox.foxy.command.FoxyCommandManager
import net.cakeyfox.foxy.command.component.FoxyComponentManager
import net.cakeyfox.foxy.listeners.GuildEventListener
import net.cakeyfox.foxy.listeners.InteractionEventListener
import net.cakeyfox.foxy.listeners.MajorEventListener
import net.cakeyfox.foxy.utils.ActivityUpdater
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import net.cakeyfox.foxy.utils.config.FoxyConfig
import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.foxy.utils.database.MongoDBClient
import net.dv8tion.jda.api.requests.GatewayIntent
import net.dv8tion.jda.api.utils.cache.CacheFlag
import kotlin.reflect.jvm.jvmName

class FoxyInstance(
    val config: FoxyConfig
) {
    lateinit var jda: JDA
    lateinit var mongoClient: MongoDBClient
    lateinit var commandHandler: FoxyCommandManager
    lateinit var artistryClient: ArtistryClient
    lateinit var utils: FoxyUtils
    lateinit var interactionManager: FoxyComponentManager
    lateinit var environment: String
    lateinit var httpClient: HttpClient

    fun start() {
        val logger = KotlinLogging.logger(this::class.jvmName)
        mongoClient = MongoDBClient(this)
        commandHandler = FoxyCommandManager(this)
        utils = FoxyUtils(this)
        interactionManager = FoxyComponentManager(this)
        environment = config.environment
        artistryClient = ArtistryClient(config.artistryKey)
        httpClient = HttpClient(CIO) {
            install(HttpTimeout) {
                requestTimeoutMillis = 60_000
            }

            install(ContentNegotiation) {
                json()
            }
        }

        jda = JDABuilder.createDefault(config.discordToken)
            .setEnabledIntents(
                GatewayIntent.GUILD_MEMBERS,
                GatewayIntent.MESSAGE_CONTENT,
                GatewayIntent.GUILD_MESSAGES,
                GatewayIntent.GUILD_EMOJIS_AND_STICKERS,
                GatewayIntent.SCHEDULED_EVENTS
            )
            .enableCache(CacheFlag.SCHEDULED_EVENTS)
            .enableCache(CacheFlag.MEMBER_OVERRIDES)
            .disableCache(CacheFlag.VOICE_STATE)
            .build()

        jda.addEventListener(
            MajorEventListener(this),
            GuildEventListener(this),
            InteractionEventListener(this)
        )

        jda.awaitReady()

        ActivityUpdater(this)

        Runtime.getRuntime().addShutdownHook(Thread {
            logger.info { "Shutting down..." }
            jda.awaitShutdown()
            httpClient.close()
        })
    }
}