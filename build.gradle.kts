import org.jetbrains.kotlin.gradle.dsl.KotlinJvmProjectExtension
import org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    java
    kotlin("jvm") apply false
    kotlin("multiplatform") apply false
    kotlin("plugin.serialization")
    id("com.gradleup.shadow") version "9.0.0-beta13"
    base
}

group = "net.cakeyfox"
version = "2025-SNAPSHOT"

allprojects {
    repositories {
        mavenLocal()
        mavenCentral()

        maven("https://jitpack.io")
        maven("https://m2.dv8tion.net/releases")
    }
}

subprojects {
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