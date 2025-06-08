plugins {
    java
    kotlin("jvm") version Versions.KOTLIN
    kotlin("plugin.serialization") version Versions.KOTLIN
    id("com.gradleup.shadow")
    application
}

group = "net.cakeyfox"
version = Versions.FOXY_VERSION

dependencies {
    implementation(project(":artistry-client"))
    implementation(project(":common"))
    implementation(project(":cirno-serializable"))

    // Discord
    implementation(libs.jda)
    implementation("club.minnced:jda-ktx:${Versions.JDA_KTX}")

    // Database
    implementation("org.mongodb:bson-kotlinx:${Versions.MONGODB}")
    implementation("org.mongodb:mongodb-driver-kotlin-coroutine:${Versions.MONGODB}")
    implementation("com.github.FoxyTheBot:DatabaseUtils:1.0.0")

    // Ktor
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("io.ktor:ktor-serialization-kotlinx-json:${Versions.KTOR}")
    implementation("io.ktor:ktor-client-core:${Versions.KTOR}")
    implementation("io.ktor:ktor-server-netty:${Versions.KTOR}")
    implementation("io.ktor:ktor-server-core:${Versions.KTOR}")
    implementation("io.ktor:ktor-client-content-negotiation:${Versions.KTOR}")
    implementation("io.ktor:ktor-client-cio:${Versions.KTOR}")
    implementation("io.ktor:ktor-server-content-negotiation:${Versions.KTOR}")
    implementation("io.ktor:ktor-server-auth:${Versions.KTOR}")

    // ThreadFactoryBuilder
    implementation("com.google.guava:guava:32.1.3-jre")

    // Caching
    implementation("com.github.ben-manes.caffeine:caffeine:${Versions.CAFFEINE}")

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

tasks.test {
    useJUnitPlatform()
}

tasks {
    shadowJar {
        archiveBaseName.set("Foxy")
        archiveVersion.set(version.toString())
        archiveClassifier.set("")
        mergeServiceFiles()
    }
}

application {
    mainClass.set("net.cakeyfox.foxy.FoxyLauncher")
}

kotlin {
    jvmToolchain(Versions.JVM_TARGET)
}