plugins {
    java
    kotlin("jvm")
    kotlin("plugin.serialization")
    id("com.gradleup.shadow")
    application
}

dependencies {
    implementation(libs.kotlin.stdlib.jdk8)
    implementation(project(":showtime-client"))
    implementation(project(":common"))
    implementation(project(":serializable-commons"))

    // Discord
    implementation(libs.jda)
    implementation("com.github.freya022:jda-ktx:8929de93af")

    // Coroutines and DateTime
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.debug)
    implementation(libs.kotlinx.datetime)

    // Database
    implementation(libs.mongodb.bson)
    implementation(libs.mongodb.coroutine.driver)
    implementation(libs.foxy.databaseutils)

    // Ktor
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.cio)
    implementation(libs.ktor.server.auth)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.htmx)
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.cio)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.serialization.json)

    // Serialization
    implementation(libs.kotlinx.serialization.core)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.kotlinx.serialization.hocon)
    implementation(libs.jackson.dataformat.yaml)
    implementation(libs.jackson.module.kotlin)

    // Logging
    implementation(libs.logback.classic)
    implementation(libs.kotlin.logging)

    // Thread Factory
    implementation(libs.guava)

    // Caching
    implementation(libs.caffeine)

    // HTML Parsing
    implementation(libs.jsoup)
}

tasks.test {
    useJUnitPlatform()
}


application {
    mainClass.set("net.cakeyfox.foxy.FoxyLauncher")
}

tasks {
    shadowJar {
        archiveBaseName.set("Foxy")
        archiveVersion.set(version.toString())
        archiveClassifier.set("")
        mergeServiceFiles()
    }
}

kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(Versions.JVM_TARGET))
    }
}