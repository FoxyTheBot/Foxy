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
            library("jda", "net.dv8tion", "JDA").version("5.3.0")
        }
    }
}
rootProject.name = "foxy-parent"

include("foxy")
include("artistry-client")
include("common")
include("cirno-serializable")
