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