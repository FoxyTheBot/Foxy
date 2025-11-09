import org.gradle.api.DefaultTask
import org.gradle.api.file.DirectoryProperty
import org.gradle.api.file.RegularFileProperty
import org.gradle.api.provider.Property
import org.gradle.api.tasks.*
import org.gradle.work.InputChanges
import java.io.File
import java.net.URL
import java.util.concurrent.TimeUnit
import kotlin.concurrent.thread

/**
 * Converts a SASS file to a CSS file and puts the converted file into `build/sass/[outputSass]`
 *
 * The Dart Sass implementation will be downloaded, based on your current operating system, after that, your SASS file will be converted to CSS.
 *
 * Don't forget to include the generated CSS file into your resources!
 *
 * ```
 * from(sassTask) {
 *   into("static/v3/assets/css/")
 * }
 * ```
 *
 * This is just a hacky workaround, because the Gradle task we were using before isn't supported in Gradle 7, however this is a nice workaround that seems to work fine :)
 *
 * @param inputSass the file that will be converted
 */
@CacheableTask
abstract class SassTask : DefaultTask() {
    @get:PathSensitive(PathSensitivity.RELATIVE)
    @get:InputFile
    abstract val inputSass: RegularFileProperty

    // Actually this is not used, but it is used to trigger a rebuild if any of the files were changed
    @get:PathSensitive(PathSensitivity.RELATIVE)
    @get:InputDirectory
    abstract val inputSassFolder: DirectoryProperty

    @get:Input
    abstract val sassVersion: Property<String>

    @get:OutputDirectory
    abstract val outputSass: DirectoryProperty

    init {
        sassVersion.convention("1.35.2")
    }

    @TaskAction
    fun execute(inputChanges: InputChanges) {
        val sassVersion = sassVersion.get()
        val operatingSystem = org.gradle.nativeplatform.platform.internal.DefaultNativePlatform.getCurrentOperatingSystem()

        val isWindows = operatingSystem.internalOs.isWindows
        val isLinux = operatingSystem.internalOs.isLinux
        val isMacOsX = operatingSystem.internalOs.isMacOsX

        val folderName = when {
            isWindows -> "windows"
            isLinux -> "linux"
            isMacOsX -> "macosx"
            else -> throw UnsupportedOperationException("Unsupported OS $operatingSystem! The sassTask code must be updated to support it!")
        }

        val url = when {
            isWindows -> "https://github.com/sass/dart-sass/releases/download/$sassVersion/dart-sass-$sassVersion-windows-x64.zip"
            isLinux -> "https://github.com/sass/dart-sass/releases/download/$sassVersion/dart-sass-$sassVersion-linux-x64.tar.gz"
            isMacOsX -> "https://github.com/sass/dart-sass/releases/download/$sassVersion/dart-sass-$sassVersion-macos-x64.tar.gz"
            else -> throw UnsupportedOperationException("Unsupported OS $operatingSystem! The sassTask code must be updated to support it!")
        }

        // The "caches" folder is used by Paperweight, so that's why I used the same name
        val dartSassTempFolder = File(project.rootDir, ".gradle/caches/dart-sass-$sassVersion")
        dartSassTempFolder.mkdirs()

        val dartSassOsTempFolder = File(dartSassTempFolder, folderName)

        if (!dartSassOsTempFolder.exists()) {
            dartSassOsTempFolder.mkdirs()
            logger.lifecycle("Downloading SASS from $url to $dartSassOsTempFolder... Hang tight!")
            val sass = URL(url).readBytes()

            val extension = if (url.endsWith(".zip"))
                "zip"
            else
                "tar.gz"

            // Write the file...
            val sassZipFile = File(dartSassTempFolder, "sass.$extension")
            sassZipFile.writeBytes(sass)

            // And then extract it!
            project.copy {
                if (extension == "zip") {
                    this.from(project.zipTree(sassZipFile))
                } else {
                    this.from(project.tarTree(project.resources.gzip(sassZipFile)))
                }
                this.into(dartSassOsTempFolder)
            }
        } else {
            logger.lifecycle("SASS version $sassVersion already exists :)")
        }

        // Execute SASS
        val originalSassLocation = inputSass.get().asFile
        val outputSassLocation = outputSass.get().asFile
        val outputSassLocationFile = File(outputSassLocation, originalSassLocation.nameWithoutExtension + ".css")

        val pb = when {
            isWindows -> {
                ProcessBuilder(
                    "cmd.exe",
                    "/C",
                    "$dartSassOsTempFolder\\dart-sass\\sass.bat",
                    originalSassLocation.toString(),
                    outputSassLocationFile.toString()
                )
            }
            isLinux || isMacOsX -> {
                ProcessBuilder(
                    "$dartSassOsTempFolder/dart-sass/sass",
                    originalSassLocation.toString(),
                    outputSassLocationFile.toString()
                )
            }

            else -> {
                throw UnsupportedOperationException("Unsupported OS $operatingSystem! The sassTask code must be updated to support it!")
            }
        }

        logger.lifecycle("Executing SASS Process: ${pb.command().joinToString()}")

        pb.redirectErrorStream(true)

        val process = pb.start()

        thread(isDaemon = true, name = "sass-gobbler") {
            process.inputStream.bufferedReader().forEachLine { line ->
                logger.lifecycle("SASS: $line")
            }
        }

        logger.lifecycle("Waiting SASS process to finish...")

        val waitFor = process.waitFor(30, TimeUnit.SECONDS)

        if (!waitFor) {
            process.destroyForcibly()
            error("SASS process timed out!")
        }

        val status = process.exitValue()

        logger.lifecycle("SASS Process Status: $status")

        if (status != 0)
            error("SASS failed! Status: $status")

        logger.lifecycle("Generated SASS file ${outputSassLocationFile.absolutePath}")
    }
}