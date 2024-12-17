package net.cakeyfox.foxy.utils.database.utils

import com.mongodb.client.MongoCollection
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.serializable.database.Background
import net.cakeyfox.serializable.database.Layout
import org.bson.Document
import kotlin.reflect.jvm.jvmName

class ProfileUtils(
    private val instance: FoxyInstance
) {
    private val logger = KotlinLogging.logger(this::class.jvmName)

    fun getBackground(backgroundId: String): Background {
        val collection: MongoCollection<Document> = instance.mongoClient.database!!.getCollection("backgrounds")

        val query = Document("id", backgroundId)
        val existingUserDocument = collection.find(query).firstOrNull()

        if (existingUserDocument == null) {
            logger.error { "Background $backgroundId not found" }
            throw Exception("Background $backgroundId not found")
        }

        val documentToJSON = existingUserDocument?.toJson()
        return instance.mongoClient.json.decodeFromString<Background>(documentToJSON!!)
    }

    fun getLayout(layoutId: String): Layout {
        val collection: MongoCollection<Document> = instance.mongoClient.database!!.getCollection("layouts")

        val query = Document("id", layoutId)
        val existingUserDocument = collection.find(query).firstOrNull()

        if (existingUserDocument == null) {
            logger.error { "Layout $layoutId not found" }
            throw Exception("Layout $layoutId not found")
        }

        val documentToJSON = existingUserDocument?.toJson()
        println(layoutId)
        return instance.mongoClient.json.decodeFromString<Layout>(documentToJSON!!)
    }
}