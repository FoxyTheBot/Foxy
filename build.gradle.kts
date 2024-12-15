plugins {
    kotlin("jvm") version "2.0.0"
    kotlin("plugin.serialization") version "2.0.0"
    id("com.github.johnrengelman.shadow") version "7.1.2"
}

group = "net.cakeyfox"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

subprojects {
    apply(plugin = "org.jetbrains.kotlin.jvm")

    dependencies {
        // Discord
        implementation("net.dv8tion:JDA:5.0.0-beta.24")
        implementation("club.minnced:jda-ktx:0.11.0-beta.20")

        // Kotlin
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0-RC")
        implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.6.1")

        // DB
        implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
        implementation("org.mongodb:mongodb-driver-sync:5.1.4")

        // Ktor
        implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
        implementation("io.ktor:ktor-server-netty:2.3.12")
        implementation("io.ktor:ktor-server-core:2.3.12")
        implementation("io.ktor:ktor-server-content-negotiation:2.3.12")
        implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.12")
        implementation("io.ktor:ktor-client-core:2.3.12")
        implementation("io.ktor:ktor-client-cio:2.3.12")

        // Logback
        implementation("ch.qos.logback:logback-classic:1.5.3")

        // Serialization
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-hocon:1.6.3")
        implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml:2.13.0")
        implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.13.0")
    }
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(17)
}