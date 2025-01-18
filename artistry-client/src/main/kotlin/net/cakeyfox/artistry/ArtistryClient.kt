package net.cakeyfox.artistry

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.serialization.json.JsonObject

class ArtistryClient (
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
            url("http://localhost:3040/v1/$endpoint")
            header("Content-Type", "application/json")
            header("Authorization", artistryToken)
            setBody(data.toString())
        }

        return response
    }
}