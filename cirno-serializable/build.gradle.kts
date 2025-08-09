plugins {
    kotlin("multiplatform")
    kotlin("plugin.serialization") version Versions.KOTLIN
}

group = "net.cakeyfox"
version = Versions.FOXY_VERSION

repositories {
    mavenCentral()
}

kotlin {
    jvm {
        compilations.all {

        }

        withJava()
    }

    js(IR) {
        browser()
        nodejs()
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(kotlin("stdlib-common"))
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:1.6.0")
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:${Versions.KOTLINX_DATE_TIME}")
            }
        }

        val jvmMain by getting {
            dependencies {
                implementation(kotlin("stdlib-jdk8"))
            }
        }

        val jsMain by getting {
            dependencies {
                implementation(kotlin("stdlib-js"))
            }
        }
    }
}