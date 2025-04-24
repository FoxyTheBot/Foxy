package net.cakeyfox.foxy.web

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import mu.KotlinLogging
import net.cakeyfox.serializable.database.utils.FoxyConfig
import kotlin.concurrent.thread

class DashboardInstance(val config: FoxyConfig) {
    companion object {
        val logger = KotlinLogging.logger { }
    }

    private val server = embeddedServer(Netty, port = config.others.dashboardSettings.port) {
        routing {
            get("/") {
                call.respondText("abu!")
            }
        }
    }

    private val serverThread = thread(name = "Dashboard Thread") {
        logger.info { "Starting Dashboard" }
        server.start(wait = false)
    }

    fun stop() {
        logger.info { "Closing Dashboard Thread" }
        server.stop()
        serverThread.join()
    }
}