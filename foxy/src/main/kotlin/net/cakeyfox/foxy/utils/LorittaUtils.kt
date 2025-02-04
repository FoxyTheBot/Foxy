package net.cakeyfox.foxy.utils

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.serializable.loritta.*

class LorittaUtils(
    val foxy: FoxyInstance
) {
    suspend fun requestSonhosFromUser(
        context: FoxyInteractionContext,
        block: SonhosRequestBody.() -> Unit
    ): SonhosRequestResponse {
        val requestBody = SonhosRequestBody().apply(block)
        val guildId = context.guild!!.id
        val channelId = context.event.channel?.id

        val response =
            foxy.httpClient.post {
                url("https://api.loritta.website/v1/guilds/${guildId}/channels/${channelId}/sonhos/sonhos-request")
                setBody(requestBody)
                contentType(ContentType.Application.Json)
                header("Authorization", foxy.config.loritta.key)
            }

        if (response.status.value == 400) {
            throw Exception("Something went wrong | ${response.bodyAsText()} | $guildId | $channelId")
        }

        if (response.status.value == 500) {
            throw Exception("Internal server error | ${response.bodyAsText()} | $guildId | $channelId")
        }

        return foxy.json.decodeFromString<SonhosRequestResponse>(response.bodyAsText())
    }

    suspend fun sendSonhosToUser(
        context: FoxyInteractionContext,
        block: SonhosSendRequestBody.() -> Unit
    ): SonhosRequestResponse {
        val requestBody = SonhosSendRequestBody().apply(block)
        val guildId = context.guild!!.idLong
        val channelId = context.event.channelIdLong

        val response =
            foxy.httpClient.post("https://api.loritta.website/v1/guilds/${guildId}/channels/${channelId}/sonhos/sonhos-transfer") {
                setBody(requestBody)
                contentType(ContentType.Application.Json)
                header("Authorization", foxy.config.loritta.key)
            }

        return foxy.json.decodeFromString<SonhosRequestResponse>(response.bodyAsText())
    }

    suspend fun getLorittaProfile(userId: Long): ProfileResponse {
        val response = foxy.httpClient.get("https://api.loritta.website/v1/users/$userId") {
            contentType(ContentType.Application.Json)
            header("Authorization", foxy.config.loritta.key)
        }

        return foxy.json.decodeFromString(response.bodyAsText())
    }

    suspend fun checkLorittaTransactionStatus(transactionId: Long): SonhosTransferStatus? {
        val response =
            foxy.httpClient.get("https://api.loritta.website/v1/sonhos/third-party-sonhos-transfer/$transactionId") {
                contentType(ContentType.Application.Json)
                header("Authorization", foxy.config.loritta.key)
            }

        if (response.status.value != 200) {
            return null
        } else {
            return foxy.json.decodeFromString<SonhosTransferStatus>(response.bodyAsText())
        }
    }

    suspend fun getFoxyProfile(): ProfileResponse {
        val response = foxy.httpClient.get("https://api.loritta.website/v1/users/1006520438865801296") {
            contentType(ContentType.Application.Json)
            header("Authorization", foxy.config.loritta.key)
        }

        return foxy.json.decodeFromString(response.bodyAsText())
    }
}