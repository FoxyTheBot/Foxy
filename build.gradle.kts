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
    }
}

subprojects {
    apply(plugin = "org.jetbrains.kotlin.jvm")

    dependencies {
        // Discord
        implementation("net.dv8tion:JDA:${Versions.JDA}")
        implementation("club.minnced:jda-ktx:${Versions.JDA_KTX}")

        // Kotlin
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${Versions.KOTLIN_COROUTINES}")
        implementation("org.jetbrains.kotlinx:kotlinx-datetime:${Versions.KOTLINX_DATE_TIME}")

        // DB
        implementation("org.mongodb:mongodb-driver-sync:${Versions.MONGODB}")

        // Ktor
        implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
        implementation("io.ktor:ktor-server-netty:${Versions.KTOR}")
        implementation("io.ktor:ktor-server-core:${Versions.KTOR}")
        implementation("io.ktor:ktor-server-content-negotiation:${Versions.KTOR}")
        implementation("io.ktor:ktor-serialization-kotlinx-json:${Versions.KTOR}")
        implementation("io.ktor:ktor-client-core:${Versions.KTOR}")
        implementation("io.ktor:ktor-client-cio:${Versions.KTOR}")

        // Logging
        implementation("ch.qos.logback:logback-classic:1.5.3")
        implementation("io.github.microutils:kotlin-logging:${Versions.KOTLIN_LOGGING}")

        // Serialization
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:${Versions.KOTLIN_SERIALIZATION}")
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-hocon:${Versions.KOTLIN_SERIALIZATION}")
        implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml:${Versions.JACKSON}")
        implementation("com.fasterxml.jackson.module:jackson-module-kotlin:${Versions.JACKSON}")
    }
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
    jvmToolchain(17)
}