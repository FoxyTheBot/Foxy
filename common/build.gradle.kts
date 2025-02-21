plugins {
    kotlin("multiplatform")
    id("com.github.johnrengelman.shadow")
}

group = "net.cakeyfox"
version = Versions.FOXY_VERSION

repositories {
    mavenCentral()
}

kotlin {
    jvm {
        compilations.all {
            kotlinOptions.jvmTarget = Versions.JVM_TARGET.toString()
        }
    }

    jvm().compilations["main"].defaultSourceSet {
        dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-serialization-hocon:${Versions.KOTLIN_SERIALIZATION}")
        }
    }
}