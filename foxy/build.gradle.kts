plugins {
    kotlin("jvm") version Versions.KOTLIN
    kotlin("plugin.serialization") version Versions.KOTLIN_SERIALIZATION
    id("com.github.johnrengelman.shadow")
    application
}

group = "net.cakeyfox"
version = Versions.FOXY_VERSION

application {
    mainClass.set("net.cakeyfox.foxy.FoxyLauncher")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":artistry-client"))
    implementation(project(":common"))
    implementation(project(":cirno-serializable"))

    // Discord
    implementation("net.dv8tion:JDA:${Versions.JDA}")
    implementation("club.minnced:jda-ktx:${Versions.JDA_KTX}")

    // DB
    implementation("org.mongodb:mongodb-driver-sync:${Versions.MONGODB}")

    // Ktor
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("io.ktor:ktor-serialization-kotlinx-json:${Versions.KTOR}")
    implementation("io.ktor:ktor-client-core:${Versions.KTOR}")
    implementation("io.ktor:ktor-client-content-negotiation:${Versions.KTOR}")
    implementation("io.ktor:ktor-client-cio:${Versions.KTOR}")

    // Caching
    implementation("com.github.ben-manes.caffeine:caffeine:${Versions.CAFFEINE}")

    // Coroutines and DateTime
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:${Versions.KOTLIN_COROUTINES}")
    implementation("org.jetbrains.kotlinx:kotlinx-datetime:${Versions.KOTLINX_DATE_TIME}")

    // Logging
    implementation("ch.qos.logback:logback-classic:1.5.3")
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
    }
}

kotlin {
    jvmToolchain(17)
}