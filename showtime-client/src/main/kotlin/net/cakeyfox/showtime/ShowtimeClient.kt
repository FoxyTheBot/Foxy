package net.cakeyfox.showtime

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.serialization.json.JsonObject
import net.cakeyfox.serializable.data.utils.FoxyConfig

class ShowtimeClient (
    private val config: FoxyConfig,
    private val artistryToken: String
) {
    private val client = HttpClient(CIO) {
        install(HttpTimeout) {
            requestTimeoutMillis = 60_000
            connectTimeoutMillis = 60_000
            socketTimeoutMillis = 60_000
        }
    }

    suspend fun generateImage(endpoint: String, data: JsonObject): HttpResponse {
        val response = client.post {
            url(config.others.artistry.url + endpoint)
            header("Content-Type", "application/json")
            header("Authorization", artistryToken)
            setBody(data.toString())
        }

        return response
    }
}