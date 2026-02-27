package net.cakeyfox.common

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import mu.KotlinLogging
import java.io.InputStream

@Suppress("EXPECT_ACTUAL_CLASSIFIERS_ARE_IN_BETA_WARNING")
actual class FoxyLocale actual constructor(actual var locale: String) {
    private val mapper = ObjectMapper(YAMLFactory()).registerKotlinModule()
    private val logger = KotlinLogging.logger { }

    companion object {
        const val PATH = "locales"
    }

    actual val language: String
        get() = locale

    actual operator fun get(key: String, vararg placeholder: String): String {
        val resolvedLocaleFolder = when (locale.lowercase()) {
            "pt-br", "br" -> "br"
            "en-us", "us" -> "us"
            else -> "br"
        }

        val resourcePaths = listOf(
            "$PATH/$resolvedLocaleFolder/general.yml",
            "$PATH/$resolvedLocaleFolder/commands.yml",
            "$PATH/$resolvedLocaleFolder/components.yml",
            "$PATH/$resolvedLocaleFolder/modules.yml",
            "$PATH/$resolvedLocaleFolder/utils.yml",
            "$PATH/$resolvedLocaleFolder/website/main.yml",
            "$PATH/$resolvedLocaleFolder/website/header.yml",
            "$PATH/$resolvedLocaleFolder/website/dashboard.yml",
            "$PATH/$resolvedLocaleFolder/punishments.yml"
        )

        for (resourcePath in resourcePaths) {
            val inputStream: InputStream = this::class.java.classLoader.getResourceAsStream(resourcePath)
                ?: continue

            val tree = mapper.readTree(inputStream)

            val keyList = key.split(".")
            var current = tree

            for (k in keyList) {
                current = current.get(k)
                if (current == null) {
                    break
                }
            }

            if (current != null) {
                var result = current.asText()
                placeholder.forEachIndexed { index, s ->
                    result = result.replace("{${index}}", s)
                }
                return result
            }
        }

        return "!!{${key}}!!"
    }
}