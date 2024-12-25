pluginManagement {
    repositories {
        maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            /*
            Thanks to MrPowerGamerBR!
            https://github.com/LorittaBot/DeviousJDA
             */
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
