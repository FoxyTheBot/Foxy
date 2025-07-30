package net.cakeyfox.foxy.utils.api.routes

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.messages.EmbedBuilder
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.header
import io.ktor.server.request.receiveText
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.dv8tion.jda.api.utils.messages.MessageCreateData
import java.time.Instant

class PostUpvoteWebhookRoute {
    private val logger = KotlinLogging.logger { }

    companion object {
        @Serializable
        data class UpvotePayload(
            val bot: String,
            val user: String,
            val type: String? = null
        )
        private val locale = FoxyLocale("pt-br")
    }

    fun Route.postUpvoteWebhook(foxy: FoxyInstance) {
        post("/api/v1/upvote/dbl") {
            val response = withContext(Dispatchers.IO) { call.receiveText() }

            val payload = foxy.json.decodeFromString<UpvotePayload>(response)
            val userId = payload.user

            val authorizationHeader = call.request.header("Authorization")
            if (authorizationHeader == null) {
                logger.error { "Authorization header does not exists!" }
            }


            if (authorizationHeader != foxy.config.topgg.authorization) {
                logger.error { "Authorization header does not match ourselves!" }
            }
            val discordUser = foxy.shardManager.retrieveUserById(userId).await()
            foxy.database.user.addVote(userId)
            val userVotes = foxy.database.user.getFoxyProfile(userId).voteCount ?: 0
            val formattedVotes = "$userVotes voto${if (userVotes == 1) "" else "s"}"

            try {
                delay(500)
                foxy.utils.sendDM(
                    discordUser,
                    MessageCreateData.fromEmbeds(
                        EmbedBuilder {
                            title = pretty(FoxyEmotes.FoxyHowdy, locale["upvote.title"])
                            description = locale["upvote.thanksForVoting", formattedVotes]
                            thumbnail = Constants.DAILY_EMOJI
                            color = Colors.FOXY_DEFAULT
                            footer {
                                title = locale["upvote.footer"]
                            }
                        }.build()
                    )
                )

                call.respond(HttpStatusCode.OK)
            } catch (ex: Exception) {
                logger.error(ex.message, ex)
                call.respond(HttpStatusCode.InternalServerError)
            }
        }
    }
}