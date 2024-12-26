plugins {
    kotlin("jvm") version Versions.KOTLIN
    kotlin("plugin.serialization") version Versions.KOTLIN_SERIALIZATION
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
    apply(plugin = "org.jetbrains.kotlin.jvm")
}

tasks.test {
    useJUnitPlatform()
}

tasks {
    shadowJar {
        archiveBaseName.set("Foxy")
        archiveVersion.set(version.toString())
        archiveClassifier.set("")

        configurations = listOf(project.configurations.runtimeClasspath.get())
    }

    test {
        useJUnitPlatform()
    }
}


kotlin {
    jvmToolchain(Versions.JVM_TARGET)
}