package net.cakeyfox.foxy.website.routes.pages

import io.ktor.server.routing.RoutingContext
import io.ktor.server.sessions.get
import io.ktor.server.sessions.sessions
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.foxy.utils.BaseRoute
import net.cakeyfox.foxy.website.FoxyWebsite
import net.cakeyfox.foxy.website.frontend.pages.commandPage
import net.cakeyfox.foxy.website.utils.RouteUtils.checkSession
import net.cakeyfox.foxy.website.utils.RouteUtils.respondWithPage
import net.cakeyfox.serializable.data.website.FoxyCommand
import net.cakeyfox.serializable.data.website.Option
import net.cakeyfox.serializable.data.website.UserSession
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.InteractionContextType

class GetCommandsPage(val server: FoxyWebsite) : BaseRoute("/commands/{commandCategory}") {
    override suspend fun handle(context: RoutingContext, locale: FoxyLocale) {
        val lang = context.call.parameters["lang"] ?: "br"
        val commandCategory = context.call.parameters["commandCategory"] ?: return
        val user = checkSession(context.call, server, context.call.sessions.get<UserSession>())

        val commandList = server.foxy.commandHandler.commands.map {
            it.create().buildCommandInfo()
        }

        val filteredCommandList = if(commandCategory != "all") {
            commandList.filter { it.category == commandCategory }
        } else commandList

        respondWithPage(context.call) {
            commandPage(
                lang,
                user,
                server.isProduction,
                filteredCommandList,
                locale
            )
        }
    }
}