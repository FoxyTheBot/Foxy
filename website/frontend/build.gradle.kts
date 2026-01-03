plugins {
    kotlin("multiplatform")
}

group = "net.cakeyfox.foxy.website"
version = "2025-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvm()
    js(IR) {
        browser()
        binaries.executable()
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(project(":serializable-commons"))
                implementation(project(":common"))
                implementation(libs.foxy.databaseutils.common)
                implementation(libs.ktor.htmx)
                implementation(libs.ktor.htmx.html)
            }
        }

        val jsTest by getting {
            dependencies {
                implementation(kotlin("test-js"))
            }
        }
    }
}
