plugins {
    kotlin("multiplatform")
    kotlin("plugin.serialization")
}

kotlin {
    jvm()
    js(IR) {
        browser()
        binaries.executable()
    }

    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation(project(":serializable-commons"))
                implementation(libs.ktor.client.core)
                implementation(libs.ktor.client.content.negotiation)
                implementation(libs.kotlinx.serialization.json)
                implementation(libs.kotlinx.serialization.core)
                implementation(libs.ktor.serialization.json)
                implementation(libs.foxy.databaseutils.common)
                implementation(libs.ktor.htmx.html)
                implementation(libs.kotlinx.coroutines.core)
                implementation("org.jetbrains.kotlinx:kotlinx-browser:0.5.0")
            }
        }

        val jsTest by getting {
            dependencies {
                implementation(kotlin("test-js"))
            }
        }
    }
}

tasks.named("jsBrowserProductionWebpack") {
    doLast {
        val distDir = project.file("${buildDir}/distributions")
        val resourcesDir = project.file("src/jsMain/resources")
        copy {
            from(distDir)
            into(resourcesDir)
        }
    }
}