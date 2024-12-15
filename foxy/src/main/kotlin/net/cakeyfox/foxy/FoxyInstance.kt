package net.cakeyfox.foxy

import net.cakeyfox.artistry.ArtistryClient
import net.cakeyfox.foxy.command.FoxyCommandManager
import net.cakeyfox.foxy.listeners.MajorEventListener
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.JDABuilder
import net.cakeyfox.foxy.utils.FoxyConfig
import net.cakeyfox.foxy.utils.database.MongoDBClient

class FoxyInstance {
    lateinit var jda: JDA
    lateinit var mongoClient: MongoDBClient
    lateinit var commandHandler: FoxyCommandManager
    lateinit var config: FoxyConfig
    lateinit var artistryClient: ArtistryClient

    fun start() {
        config = FoxyConfig()
        commandHandler = FoxyCommandManager(this)
        mongoClient = MongoDBClient(this)
        mongoClient.init()
        artistryClient = ArtistryClient(config.get("artistry_token"))

        jda = JDABuilder.createDefault(config.get("discord_token")).build()
        jda.addEventListener(MajorEventListener(this))
        jda.awaitReady()
    }
}