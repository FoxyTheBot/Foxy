package net.cakeyfox.foxy

import kotlinx.coroutines.runBlocking
import kotlinx.io.IOException
import kotlinx.serialization.ExperimentalSerializationApi
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.utils.HoconUtils.decodeFromString
import net.cakeyfox.foxy.utils.config.FoxyConfig
import java.io.File
import java.util.*
import javax.imageio.ImageIO
import kotlin.system.exitProcess

object FoxyLauncher {
    @JvmStatic
    fun main(args: Array<String>) {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"))

        ImageIO.setUseCache(false)
        val configFile = File(System.getProperty("conf") ?: "./foxy.conf")

        if (!configFile.exists()) {
            println("Welcome to Foxy! ᗜˬᗜ")
            println("")
            println("I created a config file for you, called \"foxy.conf\"! You need to configure me before you can run anything!")
            println("")
            println("Please edit the file and then run me again!")

            copyFromJar("/foxy.conf", "./foxy.conf")

            exitProcess(1)
        }

        val config = readConfigFile<FoxyConfig>(configFile)
        runBlocking {
            FoxyInstance(config)
        }
    }

    @OptIn(ExperimentalSerializationApi::class)
    inline fun <reified T> readConfigFile(file: File): T {
        try {
            val json = file.readText()
            return Constants.HOCON.decodeFromString<T>(json)
        } catch (e: IOException) {
            e.printStackTrace()
            exitProcess(1)
        }
    }

    private fun copyFromJar(input: String, output: String) {
        val inputStream = FoxyLauncher::class.java.getResourceAsStream(input) ?: return
        File(output).writeBytes(inputStream.readAllBytes())
    }
}