import org.jetbrains.kotlin.gradle.dsl.KotlinJvmProjectExtension
import org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    java
    kotlin("jvm") version Versions.KOTLIN apply false
    kotlin("plugin.serialization") version Versions.KOTLIN
    id("com.gradleup.shadow") version Versions.SHADOW_JAR
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