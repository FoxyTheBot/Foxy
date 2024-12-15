package net.cakeyfox.artistry

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.serialization.json.JsonObject

class ArtistryClient (artistryToken: String) {
    val client = HttpClient(CIO)

    suspend fun generateImage(endpoint: String, data: JsonObject): HttpResponse {
        val response = client.post {
            url("https://artistry.foxybot.win/$endpoint")
            header("Content-Type", "application/json")
            setBody(data.toString())
        }

        return response
    }
}