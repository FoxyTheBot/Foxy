package net.cakeyfox.foxy.utils

import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.RoutingContext
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import mu.KotlinLogging
import net.cakeyfox.common.FoxyLocale

abstract class BaseRoute(
    private val basePath: String
) {
    private val logger = KotlinLogging.logger { }
    fun install(r: Route) {
        val method = detectMethod()
        val requiresLang = !basePath.startsWith("/api")
        val fullPath = if (basePath.startsWith("/api")) {
            basePath
        } else if (basePath.startsWith("/{lang}")) {
            basePath
        } else {
            "/{lang}$basePath"
        }

        val builder: Route.(String, suspend RoutingContext.(FoxyLocale) -> Unit) -> Unit =
            { path, block ->

                when (method) {
                    HttpMethod.Get -> this.get(path) {
                        val locale = resolveLocale(requiresLang) ?: return@get
                        block(this, locale)
                    }
                    HttpMethod.Post -> this.post(path) {
                        val locale = resolveLocale(requiresLang) ?: return@post
                        block(this, locale)
                    }
                    HttpMethod.Put -> this.put(path) {
                        val locale = resolveLocale(requiresLang) ?: return@put
                        block(this, locale)
                    }
                    HttpMethod.Delete -> this.delete(path) {
                        val locale = resolveLocale(requiresLang) ?: return@delete
                        block(this, locale)
                    }
                    else -> error("Unsupported method")
                }
            }

        r.builder(fullPath) { locale ->
            handle(this, locale)
        }
    }

    private suspend fun RoutingContext.resolveLocale(requiresLang: Boolean): FoxyLocale? {
        return if (requiresLang) {
            val lang = call.parameters["lang"]
            if (lang == null) {
                call.respondText("Missing language", status = HttpStatusCode.BadRequest)
                return null
            }
            FoxyLocale(lang)
        } else {
            FoxyLocale("en")
        }
    }

    protected abstract suspend fun handle(context: RoutingContext, locale: FoxyLocale)

    private fun detectMethod(): HttpMethod? {
        val name = this::class.simpleName ?: ""

        return when {
            name.startsWith("Get") -> HttpMethod.Get
            name.startsWith("Post") -> HttpMethod.Post
            name.startsWith("Put") -> HttpMethod.Put
            name.startsWith("Delete") -> HttpMethod.Delete
            name.startsWith("Route") -> null
            else -> throw IllegalArgumentException("Unknown method $name")
        }
    }
}