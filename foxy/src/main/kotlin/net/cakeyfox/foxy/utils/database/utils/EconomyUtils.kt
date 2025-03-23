package net.cakeyfox.foxy.utils.database.utils

import com.mongodb.client.model.Filters.eq
import com.mongodb.client.model.Updates.combine
import com.mongodb.client.model.Updates.push
import com.mongodb.client.model.UpdateOptions
import net.cakeyfox.foxy.utils.database.DatabaseClient
import net.cakeyfox.serializable.database.data.Transaction
import org.bson.Document
import java.util.Date

class EconomyUtils(
    private val client: DatabaseClient
) {
    suspend fun createTransaction(userId: String, transaction: Transaction) {
        val collection = client.database.getCollection<Document>("users")

        val update = combine(
            push(
                "userTransactions",
                Document()
                    .append("to", transaction.to)
                    .append("from", transaction.from)
                    .append("quantity", transaction.quantity)
                    .append("date", Date())
                    .append("received", transaction.received)
                    .append("type", transaction.type)
            )
        )

        val updateOptions = UpdateOptions().upsert(true)

        collection.updateOne(eq("_id", userId), update, updateOptions)
    }
}