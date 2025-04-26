pluginManagement {
    repositories {
        gradlePluginPortal()
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
}

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
//            library("jda", "net.dv8tion", "JDA").version("5.4.0")

            // https://github.com/LorittaBot/DeviousJDA
            library("deviousjda", "com.github.LorittaBot", "DeviousJDA").version("c4c11f7781")
        }
    }
}
rootProject.name = "foxy-parent"

include("foxy")
include("artistry-client")
include("common")
include("cirno-serializable")
