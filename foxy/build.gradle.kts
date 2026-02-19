plugins {
    java
    kotlin("jvm")
    kotlin("plugin.serialization")
    id("com.gradleup.shadow")
    application
}

dependencies {
    implementation(libs.kotlin.stdlib.jdk8)
    implementation(project(":website:frontend"))
    implementation(project(":website:dashboard:dashboard-js"))
    implementation(project(":website:dashboard:frontend"))
    implementation(project(":showtime-client"))
    implementation(project(":common"))
    implementation(project(":serializable-commons"))

    // Discord
    implementation(libs.jda)
    implementation("com.github.freya022:jda-ktx:8929de93af")

    // Music
    implementation(libs.lavalink.client)

    // Coroutines and DateTime
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.debug)
    implementation(libs.kotlinx.datetime)

    // Database
    implementation(libs.mongodb.bson)
    implementation(libs.mongodb.coroutine.driver)
    implementation(libs.foxy.databaseutils.jvm)

    // Ktor
    implementation(libs.ktor.server.status.pages)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.cio)
    implementation(libs.ktor.server.auth)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.htmx)
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.cio)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.serialization.json)

    // Serialization
    implementation(libs.kotlinx.serialization.core)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.kotlinx.serialization.hocon)
    implementation(libs.jackson.dataformat.yaml)
    implementation(libs.jackson.module.kotlin)

    // Logging
    implementation(libs.logback.classic)
    implementation(libs.kotlin.logging)

    // Thread Factory
    implementation(libs.guava)

    // Caching
    implementation(libs.caffeine)

    // HTML Parsing
    implementation(libs.jsoup)
}

evaluationDependsOn(":website:flandre-js")
evaluationDependsOn(":website:dashboard:dashboard-js")

val jsBrowserDistribution =
    tasks.getByPath(":website:flandre-js:jsBrowserDistribution")
val jsBrowserProductionWebpack =
    tasks.getByPath(":website:flandre-js:jsBrowserProductionWebpack") as org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpack

val jsDashboardBrowserDistribution = tasks.getByPath(":website:dashboard:dashboard-js:jsBrowserDistribution")
val jsDashboardProductionWebpack =
    tasks.getByPath(":website:dashboard:dashboard-js:jsBrowserProductionWebpack") as org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpack

val sass = tasks.register<SassTask>("sass-style-scss") {
    this.inputSass.set(file("src/main/styles/style.scss"))
    this.inputSassFolder.set(file("src/main/styles/"))
    this.outputSass.set(file("$buildDir/styles/style-scss"))
}


val globalSass = tasks.register<SassTask>("sass-global-style-scss") {
    this.inputSass.set(file("src/main/styles/global.scss"))
    this.inputSassFolder.set(file("src/main/styles/"))
    this.outputSass.set(file("$buildDir/styles/style-scss"))
}

val sassDashboard = tasks.register<SassTask>("sass-dashboard-style-scss") {
    this.inputSass.set(file("src/main/styles-dashboard/style.scss"))
    this.inputSassFolder.set(file("src/main/styles-dashboard/"))
    this.outputSass.set(file("$buildDir/sass/style-dashboard-scss"))
}

val skipKotlinJsBuild = (findProperty("net.cakeyfox.foxy.skipKotlinJsBuild") as String?)?.toBoolean() == true
val skipScssBuild = (findProperty("net.cakeyfox.foxy.skipScssBuild") as String?)?.toBoolean() == true

tasks.test {
    useJUnitPlatform()
}

application {
    mainClass.set("net.cakeyfox.foxy.FoxyLauncher")
}

tasks {
    processResources {
        duplicatesStrategy = DuplicatesStrategy.EXCLUDE
        from("../resources/")

        if (!skipKotlinJsBuild) {
            dependsOn(jsBrowserProductionWebpack)
            dependsOn(jsDashboardProductionWebpack)

            from(jsBrowserProductionWebpack.outputDirectory) {
                into("js/")
            }

            from(jsDashboardProductionWebpack.outputDirectory) {
                into("dashboard/js/")
            }
        }

        if (!skipScssBuild) {
            dependsOn(sass)

            from(sass) {
                into("static/v1/assets/css")
            }

            from(globalSass) {
                into("static/v1/assets/css")
            }

            from(sassDashboard) {
                into("static/dashboard/assets/css")
            }
        }
    }

    shadowJar {
        archiveBaseName.set("Foxy")
        archiveVersion.set(version.toString())
        archiveClassifier.set("")
        mergeServiceFiles()
    }
}

kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(Versions.JVM_TARGET))
    }
}