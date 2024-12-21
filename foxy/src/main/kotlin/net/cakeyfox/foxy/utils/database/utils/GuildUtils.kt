package net.cakeyfox.foxy.utils.database.utils

import com.mongodb.client.MongoCollection
import kotlinx.serialization.encodeToString
import net.cakeyfox.foxy.utils.database.MongoDBClient
import net.cakeyfox.serializable.database.data.AutoRoleModule
import net.cakeyfox.serializable.database.data.Guild
import net.cakeyfox.serializable.database.data.GuildSettings
import net.cakeyfox.serializable.database.data.WelcomerModule
import org.bson.Document

class GuildUtils(
    private val db: MongoDBClient
) {
    fun getGuild(guildId: String): Guild {
        val collection: MongoCollection<Document> = db.database!!.getCollection("guilds")

        val query = Document("_id", guildId)
        val existingDocument = collection.find(query).firstOrNull()
            ?: return createGuild(guildId)

        val documentToJSON = existingDocument.toJson()
        return db.json.decodeFromString<Guild>(documentToJSON!!)
    }

    fun deleteGuild(guildId: String) {
        val guilds = db.database!!.getCollection("guilds")
        val query = Document("_id", guildId)
        guilds.deleteOne(query)
    }

    private fun createGuild(guildId: String): Guild {
        val guilds = db.database!!.getCollection("guilds")

        val newGuild = Guild(
            _id = guildId,
            GuildJoinLeaveModule = WelcomerModule(
                isEnabled = false,
                joinChannel = null,
                alertWhenUserLeaves = false,
                leaveChannel = null,
                leaveMessage = null,
                joinMessage = null,
            ),
            AutoRoleModule = AutoRoleModule(
                isEnabled = false,
                roles = emptyList(),
            ),
            premiumKeys = emptyList(),
            guildSettings = GuildSettings(
                prefix = "f!",
                disabledCommands = emptyList(),
                blockedChannels = emptyList(),
                usersWhoCanAccessDashboard = emptyList(),
                deleteMessageIfCommandIsExecuted = false,
                sendMessageIfChannelIsBlocked = false,
            ),
            dashboardLogs = emptyList(),
        )

        val documentToJSON = db.json.encodeToString(newGuild)
        val document = Document.parse(documentToJSON)
        guilds.insertOne(document)

        return newGuild
    }
}