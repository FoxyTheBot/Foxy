pluginManagement {
    repositories {
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            library("jda", "net.dv8tion", "JDA").version("5.3.0")
        }
    }
}
rootProject.name = "Foxy"

include("foxy")
include("artistry-client")
include("common")
include("cirno-serializable")
