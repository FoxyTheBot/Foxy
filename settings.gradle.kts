plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
}
rootProject.name = "Foxy"
include("foxy")
include("artistry-client")
include("common")
include("cirno-serializable")
