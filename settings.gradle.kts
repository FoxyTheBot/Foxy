plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
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
