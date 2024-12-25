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
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")

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
    jvmToolchain(17)
}