package net.cakeyfox.foxy

import kotlinx.coroutines.runBlocking
import java.io.File

object FoxyLauncher {
    @JvmStatic
    fun main(args: Array<String>) {
        runBlocking {
            FoxyInstance().start()
        }
    }
}