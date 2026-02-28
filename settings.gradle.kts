import org.gradle.kotlin.dsl.version

pluginManagement {
    repositories {
        gradlePluginPortal()
    }

    plugins {
        kotlin("jvm") version "2.2.20"
        kotlin("multiplatform") version "2.2.20"
        kotlin("plugin.serialization") version "2.2.20"
    }
}

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            val kotlin = version("kotlin", "2.2.20")
            val kotlinxSerialization = version("kotlin-serialization", "1.8.1")
            val ktor = version("ktor", "3.2.2")
            val logback = version("logback", "1.5.8")
            val kotlinxCoroutines = version("kotlinx-coroutines", "1.10.2")
            val jackson = version("jackson", "2.18.0")

            // Kotlin
            library("kotlin-stdlib-jdk8", "org.jetbrains.kotlin", "kotlin-stdlib-jdk8").versionRef(kotlin)
            library("kotlinx-coroutines-core", "org.jetbrains.kotlinx", "kotlinx-coroutines-core").version(kotlinxCoroutines)
            library("kotlinx-coroutines-debug", "org.jetbrains.kotlinx", "kotlinx-coroutines-debug").version(kotlinxCoroutines)
            library("kotlinx-datetime", "org.jetbrains.kotlinx", "kotlinx-datetime").version("0.4.0")

            // Discord
            library("jda", "net.dv8tion", "JDA").version("6.0.0-preview_DEV")
            library("jda-ktx", "club.minnced", "jda-ktx").version("0.13.0")

            // Music
            library("lavalink-client", "dev.arbjerg", "lavalink-client").version("3.2.0")

            // Database
            library("mongodb-bson", "org.mongodb", "bson-kotlinx").version("5.5.0")
            library("mongodb-coroutine-driver", "org.mongodb", "mongodb-driver-kotlin-coroutine").version("5.5.0")
            library("foxy-databaseutils-common", "com.github.CakeyFox.DatabaseUtils", "core").version("1.4.3")
            library("foxy-databaseutils-jvm", "com.github.CakeyFox.DatabaseUtils", "core-jvm").version("1.4.3")

            // Ktor
            library("ktor-htmx", "io.ktor", "ktor-htmx").versionRef(ktor)
            library("ktor-htmx-html", "io.ktor", "ktor-htmx-html").versionRef(ktor)
            library("ktor-server-core", "io.ktor", "ktor-server-core").versionRef(ktor)
            library("ktor-server-netty", "io.ktor", "ktor-server-netty").versionRef(ktor)
            library("ktor-server-cio", "io.ktor", "ktor-server-cio").versionRef(ktor)
            library("ktor-server-auth", "io.ktor", "ktor-server-auth").versionRef(ktor)
            library("ktor-server-content-negotiation", "io.ktor", "ktor-server-content-negotiation").versionRef(ktor)
            library("ktor-server-htmx", "io.ktor", "ktor-server-htmx").versionRef(ktor)
            library("ktor-client-core", "io.ktor", "ktor-client-core").versionRef(ktor)
            library("ktor-client-cio", "io.ktor", "ktor-client-cio").versionRef(ktor)
            library("ktor-client-content-negotiation", "io.ktor", "ktor-client-content-negotiation").versionRef(ktor)
            library("ktor-serialization-json", "io.ktor", "ktor-serialization-kotlinx-json").versionRef(ktor)
            library("ktor-server-status-pages", "io.ktor", "ktor-server-status-pages").versionRef(ktor)

            // Serialization
            library("kotlinx-serialization-core", "org.jetbrains.kotlinx", "kotlinx-serialization-core").versionRef(kotlinxSerialization)
            library("kotlinx-serialization-json", "org.jetbrains.kotlinx", "kotlinx-serialization-json").versionRef(kotlinxSerialization)
            library("kotlinx-serialization-hocon", "org.jetbrains.kotlinx", "kotlinx-serialization-hocon").versionRef(kotlinxSerialization)
            library(
                "jackson-dataformat-yaml",
                "com.fasterxml.jackson.dataformat",
                "jackson-dataformat-yaml"
            ).versionRef(jackson)
            library(
                "jackson-module-kotlin",
                "com.fasterxml.jackson.module",
                "jackson-module-kotlin"
            ).versionRef(jackson)

            // Logging
            library("logback-classic", "ch.qos.logback", "logback-classic").versionRef(logback)
            library("kotlin-logging", "io.github.microutils", "kotlin-logging").version("2.1.23")

            // Cache
            library("caffeine", "com.github.ben-manes.caffeine", "caffeine").version("3.1.8")

            // Utilities
            library("guava", "com.google.guava", "guava").version("32.1.3-jre")
            library("jsoup", "org.jsoup", "jsoup").version("1.21.1")
        }
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

rootProject.name = "foxy-parent"

// Foxy
include("foxy")

// ShowtimeAPI
include("showtime-client")

// Common
include("common")
include("serializable-commons")

// Website
include("website:dashboard:frontend")
include("website:frontend")
include("website:flandre-js")
include("website:dashboard:dashboard-js")
