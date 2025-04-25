package net.cakeyfox.foxy.utils
import java.util.Properties

object VersionInfo {
    private val props: Properties = Properties().apply {
        load(ClassLoader.getSystemResourceAsStream("version.properties"))
    }

    val commitHash: String = props.getProperty("commitHash", "unknown")
    val buildNumber: String = props.getProperty("buildNumber", "local")
    val javaVersion: String = System.getProperty("java.version")
    val kotlinVersion: String = KotlinVersion.CURRENT.toString()
    val environment: String = System.getenv("ENV") ?: "DEVELOPMENT"
}
