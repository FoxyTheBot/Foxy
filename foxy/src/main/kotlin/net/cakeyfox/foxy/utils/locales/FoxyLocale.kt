package net.cakeyfox.foxy.utils.locales

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import mu.KotlinLogging
import java.io.InputStream
import kotlin.reflect.jvm.jvmName

class FoxyLocale(val locale: String) {
    private val mapper = ObjectMapper(YAMLFactory()).registerKotlinModule()
    private val logger = KotlinLogging.logger(this::class.jvmName)

    companion object {
        const val PATH = "locales"
    }

    operator fun get(key: String, vararg placeholder: String): String {
        val resourcePath = "$PATH/$locale/general.yml"
        val inputStream: InputStream = this::class.java.classLoader.getResourceAsStream(resourcePath)
            ?: return "!!{${key}}!! File not found: $resourcePath"

        val tree = mapper.readTree(inputStream)

        val keyList = key.split(".")
        var current = tree

        for (k in keyList) {
            current = current.get(k)
            if (current == null) {
                logger.warn { "Key $key not found in $resourcePath" }
                return "!!{${key}}!!"
            }
        }

        var result = current.asText()

        placeholder.forEachIndexed { index, s ->
            result = result.replace("{${index}}", s)
        }

        return result
    }
}