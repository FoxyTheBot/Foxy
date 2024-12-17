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
            .build()
        jda.addEventListener(
            MajorEventListener(this),
            GuildEventListener(this)
        )
    }
}