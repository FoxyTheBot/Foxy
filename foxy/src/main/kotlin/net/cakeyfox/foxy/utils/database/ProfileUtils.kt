package net.cakeyfox.foxy.utils.database

import kotlinx.coroutines.flow.firstOrNull
import mu.KotlinLogging
import net.cakeyfox.foxy.database.data.Background
import net.cakeyfox.foxy.database.data.Badge
import net.cakeyfox.foxy.database.data.Decoration
import net.cakeyfox.foxy.database.data.Layout
import net.cakeyfox.foxy.database.DatabaseClient
import org.bson.Document
import kotlin.reflect.jvm.jvmName

class ProfileUtils(
    private val client: DatabaseClient
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)

    suspend fun getBackground(backgroundId: String): Background {
        return client.withRetry {
            val collection = client.database.getCollection<Document>("backgrounds")

            val query = Document("id", backgroundId)
            val existingDocument = collection.find(query).firstOrNull()

            if (existingDocument == null) {
                logger.error { "Background $backgroundId not found" }
                throw Exception("Background $backgroundId not found")
            }

            val documentToJSON = existingDocument.toJson()
            client.foxy.json.decodeFromString<Background>(documentToJSON!!)
        }
    }

    suspend fun getLayout(layoutId: String): Layout {
        return client.withRetry {
            val collection = client.database.getCollection<Document>("layouts")

            val query = Document("id", layoutId)
            val existingDocument = collection.find(query).firstOrNull()

            if (existingDocument == null) {
                logger.error { "Layout $layoutId not found" }
                throw Exception("Layout $layoutId not found")
            }

            val documentToJSON = existingDocument.toJson()
            client.foxy.json.decodeFromString<Layout>(documentToJSON!!)
        }
    }

    suspend fun getDecoration(decorationId: String): Decoration {
        return client.withRetry {
            val collection = client.database.getCollection<Document>("decorations")

            val query = Document("id", decorationId)
            val existingDocument = collection.find(query).firstOrNull()

            if (existingDocument == null) {
                logger.error { "Decoration $decorationId not found" }
                throw Exception("Decoration $decorationId not found")
            }

            val documentToJSON = existingDocument.toJson()
            client.foxy.json.decodeFromString<Decoration>(documentToJSON!!)
        }
    }

    suspend fun getBadges(): List<Badge> {
        return client.withRetry {
            val collection= client.database.getCollection<Document>("badges")

            val badges = mutableListOf<Badge>()
            collection.find().collect {
                val documentToJSON = it.toJson()
                badges.add(client.foxy.json.decodeFromString<Badge>(documentToJSON!!))
            }

            badges
        }
    }
}