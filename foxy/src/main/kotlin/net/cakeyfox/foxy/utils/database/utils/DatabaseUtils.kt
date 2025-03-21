package net.cakeyfox.foxy.utils.database.utils

import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.database.MongoDBClient

class DatabaseUtils(
    val client: MongoDBClient,
    val foxy: FoxyInstance
) {
    val profile = ProfileUtils(client)
    val economy = EconomyUtils(client)
    val guild = GuildUtils(client)
    val user = UserUtils(client, foxy)
    val bot = BotUtils(client)
}