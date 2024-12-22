package net.cakeyfox.foxy.utils.config

import java.io.IOException
import java.util.Properties

class FoxyConfig {
    private val props = Properties()

    init {
        loadConfig()
    }

    private fun loadConfig() {
        val resourceStream = javaClass.classLoader.getResourceAsStream("foxy.conf")
            ?: throw IllegalStateException("Could not find foxy.conf")

        try {
            resourceStream.use { props.load(it) }
        } catch (e: IOException) {
            throw IllegalStateException("Could not load foxy.conf", e)
        }
    }

    fun get(key: String): String {
        return props.getProperty(key) ?: throw IllegalStateException("Could not find key $key in foxy.conf")
    }
}