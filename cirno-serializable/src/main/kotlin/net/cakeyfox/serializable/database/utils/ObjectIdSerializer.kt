package net.cakeyfox.serializable.database.utils

import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.*
import kotlinx.serialization.encoding.*
import org.bson.types.ObjectId
import kotlinx.serialization.json.JsonDecoder
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonPrimitive

object ObjectIdSerializer : KSerializer<ObjectId> {
    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("ObjectId", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: ObjectId) {
        encoder.encodeString(value.toHexString())
    }

    override fun deserialize(decoder: Decoder): ObjectId {
        val input = decoder as? JsonDecoder ?: throw Exception("Expected Json input")
        val jsonElement = input.decodeJsonElement()

        return if (jsonElement is JsonObject && jsonElement.containsKey("\$oid")) {
            ObjectId(jsonElement["\$oid"]!!.jsonPrimitive.content)
        } else {
            throw Exception("Invalid ObjectId format")
        }
    }
}
