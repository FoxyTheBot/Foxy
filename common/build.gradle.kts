plugins {
    kotlin("multiplatform")
    id("com.github.johnrengelman.shadow")
}

kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(Versions.JVM_TARGET))
    }

    jvm().compilations["main"].defaultSourceSet {
        dependencies {
            implementation(libs.kotlinx.serialization.core)
            implementation(libs.kotlinx.serialization.json)
            implementation(libs.kotlinx.serialization.hocon)
            implementation(libs.jackson.dataformat.yaml)
            implementation(libs.jackson.module.kotlin)
            implementation(libs.kotlinx.serialization.hocon)
        }
    }
}