import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    java
    kotlin("jvm") version Versions.KOTLIN
    kotlin("plugin.serialization") version Versions.KOTLIN
    id("com.github.johnrengelman.shadow") version Versions.SHADOW_JAR
    base
}

group = "net.cakeyfox"
version = Versions.FOXY_VERSION

allprojects {
    repositories {
        mavenCentral()
        maven("https://jitpack.io")
        maven("https://m2.dv8tion.net/releases")
    }
}

subprojects {
    tasks.withType<KotlinCompile> {
        kotlinOptions.javaParameters = true
    }
}