plugins {
    kotlin("multiplatform")
    kotlin("plugin.serialization")
}

group = "net.cakeyfox.foxy.dashboard"
version = "2025-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvm()
    js(IR) {
        browser()
        binaries.executable()
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(libs.ktor.client.core)
                implementation(libs.ktor.client.content.negotiation)
                implementation(libs.kotlinx.serialization.json)
                implementation(libs.kotlinx.serialization.core)
                implementation(libs.ktor.serialization.json)
                implementation(libs.ktor.client.cio)
                implementation(project(":serializable-commons"))
                implementation(project(":website:frontend"))
                implementation(project(":common"))
                implementation(libs.foxy.databaseutils.common)
                implementation(libs.ktor.htmx)
                implementation(libs.ktor.htmx.html)
                implementation(libs.kotlinx.serialization.json)
                implementation(libs.kotlinx.serialization.core)
            }
        }
    }
}
