package net.cakeyfox.foxy

import kotlinx.coroutines.runBlocking
import kotlinx.io.IOException
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.hocon.Hocon
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.utils.HoconUtils.decodeFromString
import net.cakeyfox.foxy.utils.HostnameUtils
import net.cakeyfox.foxy.utils.checkConfigFile
import net.cakeyfox.foxy.utils.installCoroutinesDebugProbes
import net.cakeyfox.serializable.data.utils.FoxyConfig
import java.io.File
import javax.imageio.ImageIO
import kotlin.reflect.jvm.jvmName
import kotlin.system.exitProcess

object FoxyLauncher {
    private val logger = KotlinLogging.logger { }
    @OptIn(ExperimentalSerializationApi::class)
    val HOCON = Hocon { useArrayPolymorphism = true }

    @JvmStatic
    fun main(args: Array<String>) {
        installCoroutinesDebugProbes()

        ImageIO.setUseCache(false)
        val configFile = checkConfigFile()

        val config = readConfigFile<FoxyConfig>(configFile)
        val hostname = HostnameUtils.getHostname()
        val clusterId = if (config.discord.getClusterIdFromHostname) {
            try {
                // If the hostname is in the expected format, extract the ID after the "-"
                hostname.split("-")[1].toInt()
            } catch (_: IndexOutOfBoundsException) {
                logger.error { "Invalid hostname ($hostname)! The hostname must contain '-' followed by a numeric ID (e.g., foxy-1)." }
                exitProcess(1)

            } catch (_: NumberFormatException) {
                logger.error { "Invalid ID in hostname ($hostname)! The value after '-' must be a number (e.g., foxy-1)." }
                exitProcess(1)
            }
        } else config.discord.replicaId


        val currentCluster = config.discord.clusters.find { it.id == clusterId }
            ?: run {
                logger.error { "Cluster $hostname (${clusterId}) not found in config file" }
                exitProcess(1)
            }

        logger.info { "Starting Foxy on Cluster ${currentCluster.id} (${currentCluster.name})" }

        runBlocking {
            FoxyInstance(config, currentCluster).start()
        }
    }

    @OptIn(ExperimentalSerializationApi::class)
    inline fun <reified T> readConfigFile(file: File): T {
        try {
            val json = file.readText()
            return HOCON.decodeFromString<T>(json)
        } catch (e: IOException) {
            e.printStackTrace()
            exitProcess(1)
        }
    }
}