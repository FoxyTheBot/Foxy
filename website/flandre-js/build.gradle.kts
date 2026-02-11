plugins {
    kotlin("multiplatform")
    kotlin("plugin.serialization")
}

kotlin {
    js(IR) {
        browser()
        binaries.executable()
    }

    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation(project(":website:dashboard:dashboard-js"))
                implementation("org.jetbrains.kotlinx:kotlinx-browser:0.5.0")
                implementation(libs.kotlinx.serialization.json)
                implementation(libs.kotlinx.serialization.core)
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