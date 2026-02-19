package net.cakeyfox.foxy.website.utils

class DiscordAPIException(
    val code: Int,
    message: String,
    cause: Throwable? = null
) : Exception(message, cause)