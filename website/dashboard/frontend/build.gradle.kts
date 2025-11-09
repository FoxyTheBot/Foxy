plugins {
    kotlin("jvm")
}

group = "net.cakeyfox.foxy.dashboard"
version = "2025-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":serializable-commons"))
    implementation(project(":website:frontend"))
    implementation(project(":common"))
    implementation(project(":serializable-commons"))

    implementation(libs.foxy.databaseutils)
    implementation(libs.ktor.htmx)
    implementation(libs.ktor.htmx.html)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.auth)
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(Versions.JVM_TARGET)
}