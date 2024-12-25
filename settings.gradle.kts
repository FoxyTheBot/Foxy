pluginManagement {
    repositories {
        maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
        gradlePluginPortal()
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
}

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            library("deviousjda", "com.github.LorittaBot", "DeviousJDA").version("665dd9215b")
        }
    }
}
rootProject.name = "Foxy"

/* ---- [Foxy] ---- */
include("foxy")

/* ---- [Artistry] ---- */
include("artistry-client")

/* ---- [Common] ---- */
include("common")

/* ---- [Serializable] ---- */
include("cirno-serializable")
