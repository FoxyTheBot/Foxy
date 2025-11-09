package net.cakeyfox.common

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import java.io.InputStream

class FoxyLocale(var locale: String) {
    private val mapper = ObjectMapper(YAMLFactory()).registerKotlinModule()

    companion object {
        const val PATH = "locales"
    }

    val language: String
        get() = locale
    
    operator fun get(key: String, vararg placeholder: String): String {
        when(locale) {
            "br" -> locale = "pt-br"
            "us" -> locale = "en-us"
            else -> locale = "pt-br"
        }

        val resourcePaths = listOf(
            "$PATH/$locale/general.yml",
            "$PATH/$locale/commands.yml",
            "$PATH/$locale/components.yml",
            "$PATH/$locale/modules.yml",
            "$PATH/$locale/utils.yml",
            "$PATH/$locale/website/main.yml",
            "$PATH/$locale/website/header.yml",
            "$PATH/$locale/website/dashboard.yml"
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