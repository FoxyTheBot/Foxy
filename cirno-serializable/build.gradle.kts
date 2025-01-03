plugins {
    kotlin("jvm")
    kotlin("plugin.serialization") version Versions.KOTLIN_SERIALIZATION
}

group = "net.cakeyfox"
version = Versions.FOXY_VERSION

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))

    // DateTime
    implementation("org.jetbrains.kotlinx:kotlinx-datetime:${Versions.KOTLINX_DATE_TIME}")

    // MongoDB ObjectId
    implementation("org.mongodb:bson:4.11.0")

    // Serialization
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:${Versions.KOTLIN_SERIALIZATION}")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-hocon:${Versions.KOTLIN_SERIALIZATION}")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:${Versions.JACKSON}")
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(Versions.JVM_TARGET)
}