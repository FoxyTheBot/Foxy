package net.cakeyfox.foxy.internal.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import net.cakeyfox.foxy.FoxyInstance

class GetClusterList {
    fun Route.getClusterList(foxy: FoxyInstance) {
        get("/api/v1/foxy/clusters") {
            val clusters = foxy.config.discord.clusters
            val clustersToJson = foxy.json.encodeToString(clusters)

            call.respond(HttpStatusCode.OK, clustersToJson)
        }
    }
}