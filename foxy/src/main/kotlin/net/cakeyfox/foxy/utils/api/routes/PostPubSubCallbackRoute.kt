package net.cakeyfox.foxy.utils.api.routes

import io.ktor.http.HttpStatusCode
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

            val signatureHeader = call.request.headers["X-Hub-Signature"]
            if (signatureHeader == null) {
                call.respondText("Missing signature", status = HttpStatusCode.Unauthorized)
                return@post
            }

            val mac = Mac.getInstance("HmacSHA1").apply {
                init(SecretKeySpec(foxy.config.youtube.webhookSecret.toByteArray(), "HmacSHA1"))
            }
            val expected = "sha1=" + mac.doFinal(xmlBody.toByteArray()).joinToString("") { "%02x".format(it) }

            if (signatureHeader != expected) {
                call.respondText("Invalid signature", status = HttpStatusCode.Unauthorized)
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