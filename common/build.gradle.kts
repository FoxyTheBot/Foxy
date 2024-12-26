plugins {
    id("java")
    id("com.github.johnrengelman.shadow")
    `java-library`
}

group = "net.cakeyfox"
version = Versions.FOXY_VERSION

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-hocon:${Versions.KOTLIN_SERIALIZATION}")
}

tasks.test {
    useJUnitPlatform()
}

tasks {
    shadowJar {
        archiveBaseName.set("common")
        archiveVersion.set("1.0.0")
        archiveClassifier.set("")
    }
}

kotlin {
    jvmToolchain(Versions.JVM_TARGET)
}