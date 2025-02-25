# Developing Foxy

Originally, Foxy was developed in TypeScript, but it has now transitioned to Kotlin for enhanced performance and maintainability. I decided to move to Kotlin due to numerous issues with Node.js, TypeScript, and the TypeScript Compiler, which made development unproductive. Kotlin is our chosen language because of its expressive syntax and robust features.

## Compiling Foxy

### Requirements

- **PowerShell** (Windows) or **Terminal** (Linux/macOS).
  > While the Windows Command Prompt may work, it's recommended to use PowerShell for better compatibility.
- **JDK 21 or higher**, preferably from [Adoptium](https://adoptium.net/). Ensure the `JAVA_HOME` environment variable is set correctly.
    - **To check JAVA\_HOME:**
        - PowerShell: `echo $env:JAVA_HOME`
        - Bash: `echo $JAVA_HOME`
- **Git** for version control.
- **Gradle**, included in the project, but having it installed globally is optional.

### Preparing the Environment

Clone the repository using Git:

```bash
git clone -b master https://github.com/FoxyTheBot/Foxy.git
```

Navigate to the project folder:

```bash
cd Foxy
```

### Compiling with Gradle

Build the project with Gradle by running:

```bash
./gradlew build
```

> If you have Gradle installed globally, you can use `gradle build` instead of `./gradlew build`.

> If Gradle reports missing methods or unsupported features in your JDK, update to the latest JDK 21+ version from [Adoptium](https://adoptium.net/).

## Running Foxy
### Requirements

- All tools and dependencies from the "Compiling Foxy" section.
- **JetBrains IntelliJ IDEA** (Community Edition is sufficient).

### Opening Foxy in IntelliJ IDEA

1. Open IntelliJ IDEA.
2. Navigate to **File > Open** and select the folder where you cloned Foxy.
3. When prompted, click "Trust Project" to allow IntelliJ to load it.
4. Wait for IntelliJ to download dependencies and index the project.

### Running Foxy within IntelliJ IDEA

To run Foxy from IntelliJ:

1. Locate the `FoxyLauncher` class in the project.
2. Right-click on the file and select **Run 'FoxyLauncher'**.
3. On the first run, Foxy will generate a `foxy.conf` file in the project root.
4. Configure the `foxy.conf` file as needed and rerun `FoxyLauncher`.

If everything is configured correctly, Foxy will start successfully without unexpected explosions!

### Running Foxy Outside IntelliJ

1. Build the project using the ShadowJar plugin:

```bash
./gradlew :foxy:shadowJar
```

2. Locate the generated JAR file in the `foxy/build/libs` folder.
3. Ensure the `foxy.conf` file is properly configured.
4. Run the JAR file using:

```bash
java -jar foxy/build/libs/Foxy-VERSION.jar
```
