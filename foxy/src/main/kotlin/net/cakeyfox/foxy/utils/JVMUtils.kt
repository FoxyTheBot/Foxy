package net.cakeyfox.foxy.utils

import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.debug.DebugProbes
import net.cakeyfox.foxy.FoxyLauncher
import java.io.File

fun copyFromJar(input: String, output: String) {
    val inputStream = FoxyLauncher::class.java.getResourceAsStream(input) ?: return
    File(output).writeBytes(inputStream.readAllBytes())
}

// Let's install coroutines debug probes to get extra information about running coroutines
@OptIn(ExperimentalCoroutinesApi::class)
fun installCoroutinesDebugProbes() {
    System.setProperty("kotlinx.coroutines.debug", "on")
    System.setProperty("kotlinx.coroutines.stacktrace.recovery", "true")

    DebugProbes.enableCreationStackTraces = false
    DebugProbes.install()
}