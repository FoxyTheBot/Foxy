package net.cakeyfox.foxy

import kotlinx.coroutines.runBlocking
import net.cakeyfox.foxy.utils.FoxyConfig
import java.io.File

object FoxyLauncher {
    val config: FoxyConfig = FoxyConfig()

    @JvmStatic
    fun main(args: Array<String>) {
        runBlocking {
            FoxyInstance(config)
        }
    }
}