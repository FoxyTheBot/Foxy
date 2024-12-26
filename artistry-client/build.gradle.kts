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
    // Ktor
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("io.ktor:ktor-serialization-kotlinx-json:${Versions.KTOR}")
    implementation("io.ktor:ktor-client-core:${Versions.KTOR}")
    implementation("io.ktor:ktor-client-cio:${Versions.KTOR}")
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(Versions.JVM_TARGET)
}