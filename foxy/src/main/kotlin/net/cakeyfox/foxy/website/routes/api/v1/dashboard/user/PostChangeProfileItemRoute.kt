package net.cakeyfox.foxy.website.routes.api.v1.dashboard.user

import FoxyUserBuilder
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.response.respond
import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.RoutingContext
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.serializable.data.website.UserSession

class PostChangeProfileItemRoute(val server: FoxyWebsite) : BaseRoute("/api/v1/user/{itemType}/change/{itemId}") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val call = context.call
        val itemType = call.parameters["itemType"]
        val itemId = call.parameters["itemId"] ?: return call.respond(HttpStatusCode.BadRequest)

        val session = checkSession(
            call,
            server,
            call.sessions.get<UserSession>()
        ) ?: return call.respondRedirect(Constants.INVITE_LINK)

        val userId = session.userId
        val userData = server.foxy.database.user.getFoxyProfile(userId)

        when (itemType) {
            "background" -> handleUpdate(
                call,
                isValid = { server.foxy.database.profile.getBackground(itemId) != null },
                hasOwnership = { userData.userProfile.backgroundList.contains(itemId) },
                updateAction = { userProfile.background = itemId },
                itemId = itemId
            )

            "layout" -> handleUpdate(
                call,
                isValid = { server.foxy.database.profile.getLayout(itemId) != null },
                hasOwnership = { userData.userProfile.layoutList.contains(itemId) },
                updateAction = { userProfile.layout = itemId },
                itemId = itemId
            )

            "decoration" -> handleUpdate(
                call,
                isValid = { server.foxy.database.profile.getDecoration(itemId) != null },
                hasOwnership = { userData.userProfile.decorationList.contains(itemId) },
                updateAction = {
                    if (itemId == "none") {
                        userProfile.decoration = ""
                    } else {
                        userProfile.decoration = itemId
                    }
                },
                itemId = itemId
            )

            else -> call.respond(HttpStatusCode.BadRequest, "Invalid item type")
        }
    }

    private suspend fun handleUpdate(
        call: ApplicationCall,
        isValid: suspend () -> Boolean,
        hasOwnership: () -> Boolean,
        itemId: String,
        updateAction: FoxyUserBuilder.() -> Unit
    ) {
        if (itemId != "none") {
            if (!isValid() || !hasOwnership()) {
                return call.respond(HttpStatusCode.Forbidden, "Item not owned or invalid")
            }
        }

        server.foxy.database.user.updateUser(call.sessions.get<UserSession>()!!.userId) {
            updateAction()
        }

        call.respond(HttpStatusCode.OK, mapOf("status" to "success"))
    }
}