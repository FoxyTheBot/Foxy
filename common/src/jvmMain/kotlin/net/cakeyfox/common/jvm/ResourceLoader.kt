package net.cakeyfox.common.jvm

import java.io.InputStreamReader

object ResourceLoader {
    fun load(path: String): String? {
        return ResourceLoader::class.java.classLoader
            .getResourceAsStream(path)
            ?.use { InputStreamReader(it).readText() }
    }
}
