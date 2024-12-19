package net.cakeyfox.foxy.utils.database.utils

import com.mongodb.client.MongoCollection
import mu.KotlinLogging
import net.cakeyfox.foxy.utils.database.MongoDBClient
import net.cakeyfox.serializable.database.data.Background
import net.cakeyfox.serializable.database.data.Badge
import net.cakeyfox.serializable.database.data.Decoration
import net.cakeyfox.serializable.database.data.Layout
import org.bson.Document
import kotlin.reflect.jvm.jvmName

class ProfileUtils(
    private val client: MongoDBClient
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)

    fun getBackground(backgroundId: String): Background {
        val collection: MongoCollection<Document> = client.database!!.getCollection("backgrounds")

        val query = Document("id", backgroundId)
        val existingDocument = collection.find(query).firstOrNull()

        if (existingDocument == null) {
            logger.error { "Background $backgroundId not found" }
            throw Exception("Background $backgroundId not found")
        }

        val documentToJSON = existingDocument.toJson()
        return client.json.decodeFromString<Background>(documentToJSON!!)
    }

    fun getLayout(layoutId: String): Layout {
        val collection: MongoCollection<Document> = client.database!!.getCollection("layouts")

        val query = Document("id", layoutId)
        val existingDocument = collection.find(query).firstOrNull()

        if (existingDocument == null) {
            logger.error { "Layout $layoutId not found" }
            throw Exception("Layout $layoutId not found")
        }

        val documentToJSON = existingDocument.toJson()
        return client.json.decodeFromString<Layout>(documentToJSON!!)
    }

    fun getBadges(): List<Badge> {
        val collection: MongoCollection<Document> = client.database!!.getCollection("badges")

        val badges = mutableListOf<Badge>()
        collection.find().forEach {
            val documentToJSON = it.toJson()
            badges.add(client.json.decodeFromString<Badge>(documentToJSON!!))
        }

        return badges
    }

    fun getDecoration(decorationId: String): Decoration {
        val collection: MongoCollection<Document> = client.database!!.getCollection("decorations")

        val query = Document("id", decorationId)
        val existingDocument = collection.find(query).firstOrNull()

        if (existingDocument == null) {
            logger.error { "Decoration $decorationId not found" }
            throw Exception("Decoration $decorationId not found")
        }

        val documentToJSON = existingDocument.toJson()
        return client.json.decodeFromString<Decoration>(documentToJSON!!)
    }
}