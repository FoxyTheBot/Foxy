package net.cakeyfox.foxy.utils

import java.io.File
import kotlin.system.exitProcess

fun checkConfigFile(): File {
    val configFile = File(System.getProperty("conf") ?: "./foxy.conf")

    if (!configFile.exists()) {
        println(
            """                            
                   Welcome to Foxy!

     I created a config file for you, called "foxy.conf"!
     You need to configure me before you can run anything!

     Please edit the file and then run me again!
"""
        )

        copyFromJar("/foxy.conf", "./foxy.conf")
        exitProcess(1)

    } else return configFile
}