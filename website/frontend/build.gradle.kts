plugins {
    kotlin("jvm") version Versions.KOTLIN
}

group = "net.cakeyfox.foxy.website"
version = Versions.FOXY_VERSION

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":serializable-commons"))
    implementation(project(":common"))

    implementation(libs.ktor.htmx)
    implementation(libs.ktor.htmx.html)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.auth)
}

kotlin {
    jvmToolchain(Versions.JVM_TARGET)
}