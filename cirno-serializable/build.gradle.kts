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
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(17)
}