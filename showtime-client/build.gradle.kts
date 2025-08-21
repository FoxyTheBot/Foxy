plugins {
    id("java")
    kotlin("jvm") version Versions.KOTLIN
    `java-library`
}

group = "net.cakeyfox"
version = Versions.FOXY_VERSION

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":serializable-commons"))

    implementation(libs.kotlin.stdlib.jdk8)
    implementation(libs.ktor.serialization.json)
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.cio)
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(Versions.JVM_TARGET)
}