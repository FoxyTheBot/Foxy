plugins {
    kotlin("multiplatform")
    id("com.github.johnrengelman.shadow")
}

kotlin {
    jvm {
        compilations["main"].defaultSourceSet {
            dependencies {
                implementation(libs.kotlinx.serialization.core)
                implementation(libs.kotlinx.serialization.json)
                implementation(libs.kotlinx.serialization.hocon)
                implementation(libs.jackson.dataformat.yaml)
                implementation(libs.jackson.module.kotlin)
                implementation(libs.logback.classic)
                implementation(libs.kotlin.logging)
            }
        }
    }

    js(IR) {
        browser()
        compilations["main"].defaultSourceSet {
            dependencies {
                implementation(libs.kotlinx.serialization.core)
                implementation(libs.kotlinx.serialization.json)
            }
        }
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(libs.kotlinx.serialization.core)
                implementation(libs.kotlinx.serialization.json)
            }
        }
    }
}