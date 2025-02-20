plugins {
    kotlin("jvm") version Versions.KOTLIN
    kotlin("plugin.serialization") version Versions.KOTLIN_SERIALIZATION
    id("com.github.johnrengelman.shadow")
    id("io.freefair.sass-java") version "8.12.1"
    application
}

group = "net.cakeyfox.foxy"
version = Versions.FOXY_VERSION

repositories {
    mavenCentral()
}

application {
    mainClass.set("net.cakeyfox.foxy.web.FoxyWebLauncher")
}

dependencies {
    implementation(project(":common"))
    implementation(project(":cirno-serializable"))

    // Discord
    implementation(libs.jda)

    // MongoDB
    implementation("org.mongodb:bson-kotlinx:5.3.0")
    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:5.3.0")

    // Frontend Stuff
    implementation("org.jetbrains.kotlinx:kotlinx-html-jvm:0.9.1")
    implementation("io.ktor:ktor-server-html-builder:${Versions.KTOR}")

    // Server Stuff
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("io.ktor:ktor-serialization-kotlinx-json:${Versions.KTOR}")
    implementation("io.ktor:ktor-server-netty:${Versions.KTOR}")
    implementation("io.ktor:ktor-server-core:${Versions.KTOR}")
    implementation("io.ktor:ktor-server-content-negotiation:${Versions.KTOR}")
    implementation("io.ktor:ktor-server-auth:${Versions.KTOR}")

    // Coroutines and DateTime
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${Versions.KOTLIN_COROUTINES}")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-debug:${Versions.KOTLIN_COROUTINES}")
    implementation("org.jetbrains.kotlinx:kotlinx-datetime:${Versions.KOTLINX_DATE_TIME}")

    // Logging
    implementation("ch.qos.logback:logback-classic:${Versions.LOGBACK}")
    implementation("io.github.microutils:kotlin-logging:${Versions.KOTLIN_LOGGING}")

    // Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:${Versions.KOTLIN_SERIALIZATION}")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-hocon:${Versions.KOTLIN_SERIALIZATION}")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml:${Versions.JACKSON}")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:${Versions.JACKSON}")
}


tasks.named<io.freefair.gradle.plugins.sass.SassCompile>("compileSass") {
    source = fileTree("src/main/resources/scss")
    destinationDir = file("src/main/resources/css")
}

tasks {
    shadowJar {
        archiveBaseName.set("FoxyWeb")
        archiveVersion.set(version.toString())
        archiveClassifier.set("")
    }
}

kotlin {
    jvmToolchain(Versions.JVM_TARGET)
}