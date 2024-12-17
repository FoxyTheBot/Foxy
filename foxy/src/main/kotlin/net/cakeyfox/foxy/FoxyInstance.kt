package net.cakeyfox.foxy

import net.cakeyfox.artistry.ArtistryClient
import net.cakeyfox.foxy.command.FoxyCommandManager
import net.cakeyfox.foxy.listeners.GuildEventListener
import net.cakeyfox.foxy.listeners.MajorEventListener
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import net.cakeyfox.foxy.utils.FoxyConfig
import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.foxy.utils.database.MongoDBClient
import net.dv8tion.jda.api.requests.GatewayIntent

class FoxyInstance(
    val config: FoxyConfig
) {
    var jda: JDA
    var mongoClient: MongoDBClient = MongoDBClient(this)
    var commandHandler: FoxyCommandManager = FoxyCommandManager(this)
    var artistryClient: ArtistryClient = ArtistryClient(config.get("artistry_token"))
    var utils = FoxyUtils(this)

    init {
        jda = JDABuilder.createDefault(config.get("discord_token"))
            .setEnabledIntents(
                GatewayIntent.GUILD_MEMBERS,
                GatewayIntent.MESSAGE_CONTENT,
                GatewayIntent.GUILD_MESSAGES,
                GatewayIntent.GUILD_VOICE_STATES,
                GatewayIntent.GUILD_EMOJIS_AND_STICKERS,
                GatewayIntent.SCHEDULED_EVENTS
            )
            .build()
        jda.addEventListener(
            MajorEventListener(this),
            GuildEventListener(this)
        )
    }
}