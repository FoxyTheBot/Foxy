package net.cakeyfox.foxy

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.debug.DebugProbes
import kotlinx.coroutines.runBlocking
import kotlinx.io.IOException
import kotlinx.serialization.ExperimentalSerializationApi
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.utils.HoconUtils.decodeFromString
import net.cakeyfox.foxy.utils.HostnameUtils
import net.cakeyfox.foxy.utils.config.FoxyConfig
import java.io.File
import javax.imageio.ImageIO
import kotlin.reflect.jvm.jvmName
import kotlin.system.exitProcess

object FoxyLauncher {
    private val logger = KotlinLogging.logger(this::class.jvmName)

    @JvmStatic
    fun main(args: Array<String>) {
        installCoroutinesDebugProbes()

        ImageIO.setUseCache(false)
        val configFile = File(System.getProperty("conf") ?: "./foxy.conf")

        if (!configFile.exists()) {
            println(
                """                            
                   Welcome to Foxy!

     I created a config file for you, called "foxy.conf"!
     You need to configure me before you can run anything!

     Please edit the file and then run me again!
"""
            )

            copyFromJar("/foxy.conf", "./foxy.conf")

            exitProcess(1)
        }

        val config = readConfigFile<FoxyConfig>(configFile)
        val hostname = HostnameUtils.getHostname()
        val currentCluster = config.discord.clusters.find { it.id == hostname }
            ?: run {
                logger.error { "Cluster $hostname not found in config file" }
                exitProcess(1)
            }

        logger.info { "Starting Foxy on cluster ${currentCluster.name} (${currentCluster.id})" }

        runBlocking {
            FoxyInstance(config, currentCluster).start()
        }
    }

    // Let's install coroutines debug probes to get extra information about running coroutines
    @OptIn(ExperimentalCoroutinesApi::class)
    private fun installCoroutinesDebugProbes() {
        System.setProperty("kotlinx.coroutines.debug", "on")
        System.setProperty("kotlinx.coroutines.stacktrace.recovery", "true")

        DebugProbes.enableCreationStackTraces = false
        DebugProbes.install()
    }

    private fun copyFromJar(input: String, output: String) {
        val inputStream = this::class.java.getResourceAsStream(input) ?: return
        File(output).writeBytes(inputStream.readAllBytes())
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
}