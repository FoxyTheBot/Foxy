package net.cakeyfox.foxy.utils

object HostnameUtils {
    fun getHostname(): String {
        try {
            val process = Runtime.getRuntime().exec("hostname")
            val reader = process.inputStream.bufferedReader()
            val hostname = reader.readLine()
            reader.close()
            return hostname.lowercase()
        } catch (e: Exception) {
            throw RuntimeException("Failed to get hostname", e)
        }
    }
}