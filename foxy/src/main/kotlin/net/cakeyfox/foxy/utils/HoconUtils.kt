package net.cakeyfox.foxy.utils

import com.typesafe.config.ConfigFactory
import kotlinx.serialization.hocon.Hocon
import kotlinx.serialization.hocon.decodeFromConfig

object HoconUtils {
    inline fun <reified T> Hocon.decodeFromString(string: String): T = decodeFromConfig(ConfigFactory.parseString(string).resolve())
}