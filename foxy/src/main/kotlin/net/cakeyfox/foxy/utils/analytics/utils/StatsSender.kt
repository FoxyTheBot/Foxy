package net.cakeyfox.foxy.utils.analytics.utils

interface StatsSender {
    suspend fun send(guildCount: Long): Boolean
}