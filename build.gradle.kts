import org.jetbrains.kotlin.gradle.dsl.KotlinJvmProjectExtension
import org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    java
    kotlin("jvm") version Versions.KOTLIN apply false
    kotlin("plugin.serialization") version Versions.KOTLIN
    id("com.gradleup.shadow") version Versions.SHADOW_JAR
    id("org.jlleitschuh.gradle.ktlint") version "14.0.1"
    base
}

group = "net.cakeyfox"
version = Versions.FOXY_VERSION

allprojects {
    repositories {
        mavenLocal()
        mavenCentral()

        maven("https://jitpack.io")
        maven("https://m2.dv8tion.net/releases")
    }
}

subprojects {
    apply(plugin = "org.jlleitschuh.gradle.ktlint")

    ktlint {
        version.set("1.8.0")
        android.set(false)
        verbose.set(true)
        outputToConsole.set(true)
        coloredOutput.set(true)
        ignoreFailures.set(false)
    }

    plugins.withId("org.jetbrains.kotlin.multiplatform") {
        extensions.configure<KotlinMultiplatformExtension> {
            jvmToolchain(21)
        }
    }

    plugins.withId("org.jetbrains.kotlin.jvm") {
        extensions.configure<KotlinJvmProjectExtension> {
            jvmToolchain(21)
        }
    }

    tasks.withType<KotlinCompile> {
        compilerOptions {
            this.javaParameters = true
        }
    }
}