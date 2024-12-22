package net.cakeyfox.foxy

import kotlinx.coroutines.runBlocking
import net.cakeyfox.foxy.utils.config.FoxyConfig

object FoxyLauncher {
    private val config: FoxyConfig = FoxyConfig()

    @JvmStatic
    fun main(args: Array<String>) {
        runBlocking {
            FoxyInstance(config)
        }
    }
}