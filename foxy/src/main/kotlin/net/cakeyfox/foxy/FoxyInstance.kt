package net.cakeyfox.foxy

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
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
import net.cakeyfox.foxy.utils.FoxyHelpers
import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.foxy.utils.database.MongoDBClient
import net.dv8tion.jda.api.requests.GatewayIntent
import net.dv8tion.jda.api.utils.cache.CacheFlag

class FoxyInstance(
    val config: FoxyConfig
) {
    var jda: JDA
    val mongoClient: MongoDBClient = MongoDBClient(this)
    val commandHandler: FoxyCommandManager = FoxyCommandManager(this)
    val artistryClient: ArtistryClient = ArtistryClient(config.artistryKey)
    val utils = FoxyUtils(this)
    val helpers = FoxyHelpers(this)
    val interactionManager = FoxyComponentManager(this)
    val environment = config.environment
    val httpClient = HttpClient(CIO) {
        install(HttpTimeout) {
            requestTimeoutMillis = 60_000
        }

        install(ContentNegotiation) {
            json()
        }
    }

    // TODO: Implements sharding manager

    init {
        jda = JDABuilder.createDefault(config.discordToken)
            .setEnabledIntents(
                GatewayIntent.GUILD_MEMBERS,
                GatewayIntent.MESSAGE_CONTENT,
                GatewayIntent.GUILD_MESSAGES,
                GatewayIntent.GUILD_VOICE_STATES,
                GatewayIntent.GUILD_EMOJIS_AND_STICKERS,
                GatewayIntent.SCHEDULED_EVENTS
            )
            .enableCache(CacheFlag.SCHEDULED_EVENTS)
            .enableCache(CacheFlag.MEMBER_OVERRIDES)
            .build()
        jda.addEventListener(
            MajorEventListener(this),
            GuildEventListener(this),
            InteractionEventListener(this)
        )

        ActivityUpdater(this)
    }
}