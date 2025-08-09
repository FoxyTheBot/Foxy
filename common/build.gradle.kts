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
            implementation("org.jetbrains.kotlinx:kotlinx-serialization-hocon:${Versions.KOTLIN_SERIALIZATION}")
        }
    }
}