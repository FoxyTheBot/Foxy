package net.cakeyfox.foxy.utils.api.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.request.header
import io.ktor.server.request.receiveText
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import org.jsoup.Jsoup
import org.jsoup.parser.Parser
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

class PostPubSubCallbackRoute(
    val foxy: FoxyInstance
) {
    private val manager = foxy.youtubeManager
    private val logger = KotlinLogging.logger { }

    fun Route.getYouTubeWebhook() {
        get("/api/v1/youtube/webhook") {
            val challenge = call.request.queryParameters["hub.challenge"]
            if (challenge != null) {
                logger.info { "Received GET from PubSubHubbub!" }
                call.respondText(challenge)
            } else {
                call.respondText("No challenge")
            }
        }
    }

    fun Route.postYouTubeWebhook() {
        post("/api/v1/youtube/webhook") {
            val xmlBody = call.receiveText()

            val originalSignature = call.request.header("X-Hub-Signature")
            if (originalSignature == null) {
                logger.warn { "Missing X-Hub-Signature Header from Request!" }
                call.respondText("Missing X-Hub-Signature Header from Request", status = HttpStatusCode.BadRequest)
                return@post
            }

            val secret = foxy.config.youtube.webhookSecret
            val computedSignature = when {
                originalSignature.startsWith("sha1=") -> {
                    val signingKey = SecretKeySpec(secret.toByteArray(Charsets.UTF_8), "HmacSHA1")
                    val mac = Mac.getInstance("HmacSHA1").apply { init(signingKey) }
                    val doneFinal = mac.doFinal(xmlBody.toByteArray(Charsets.UTF_8))
                    "sha1=" + doneFinal.joinToString("") { "%02x".format(it) }
                }

                originalSignature.startsWith("sha256=") -> {
                    val signingKey = SecretKeySpec(secret.toByteArray(Charsets.UTF_8), "HmacSHA256")
                    val mac = Mac.getInstance("HmacSHA256").apply { init(signingKey) }
                    val doneFinal = mac.doFinal(xmlBody.toByteArray(Charsets.UTF_8))
                    "sha256=" + doneFinal.joinToString("") { "%02x".format(it) }
                }

                else -> {
                    logger.error { "Unsupported signature algorithm in header: $originalSignature" }
                    call.respondText("Unsupported signature algorithm", status = HttpStatusCode.BadRequest)
                    return@post
                }
            }

            if (originalSignature != computedSignature) {
                logger.warn { "Invalid X-Hub-Signature Header from Request!" }
                call.respondText("Invalid X-Hub-Signature Header from Request", status = HttpStatusCode.BadRequest)
                return@post
            }

            val doc = Jsoup.parse(xmlBody, "", Parser.xmlParser())
            val entry = doc.selectFirst("entry")
            val videoId = entry?.selectFirst("yt|videoId")?.text()
            val channelId = entry?.selectFirst("yt|channelId")?.text()
            val author = entry?.selectFirst("author > name")?.text() ?: "Unknown"
            val videoUrl = entry?.selectFirst("link[rel=alternate]")?.attr("href") ?: return@post

            logger.info { "Notifying from PubHubSubbub for $channelId" }
            if (videoId != null && channelId != null) {
                foxy.database.youtube.getOrRegisterYouTubeWebhook(channelId)
                manager.notifyGuilds(channelId, author, videoUrl, videoId)
            }

            call.respondText("OK")
        }
    }
}