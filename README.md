<p align="center">
<img src="https://socialify.git.ci/FoxyTheBot/Foxy/image?language=1&logo=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F74120553%3Fs%3D200%26v%3D4&name=1&owner=1&pattern=Circuit%20Board&stargazers=1&theme=Dark">
<h1 align="center">Foxy</h1>
  <p align="center">

 <a href="https://jetbrains.com/?from=FoxyTheBot">
    <img src="https://img.shields.io/badge/Powered_by_WebStorm-gray.svg?logo=webstorm&style=for-the-badge" />
  </a>
</p>

# 🤔 | Who am I?
Hi, I'm Foxy! I will entertain your server with my commands

<br>

## 🏗 | Preparing the environment

### 📕 | Terms:
You cannot use the Foxy's image in privates or public instances, the code in this repository is intended for Foxy contributors, If you want to run Foxy by yourself as self-host, you can, but WE DO NOT SUPPORT self-host.
At your own risk

Pursuant to the license, you may modify Foxy's source code, but you are required to make the code public including the modifications.
<br>

### ⚠ | Requirements:

- NodeJS v16.x or higher
- Git
- npm

<br>

## 🤔 | How can I run Foxy?
<br>
<p>You need to install TSC (TypeScript Compiler)</p>

```bash
npm i -g typescript
```

## Values that you need to change
<br>

```json
{
  "ownerId": "<YOUR-ID>", 
  "clientId": "<BOT-ID>", 
  "prefix": "<BOT-PREFIX>", 
  "token": "<BOT-TOKEN>", 
  "mongouri": "<MONGODB-URI>", 
  "dblauth": "<TOPGG-AUTH>", 

    "webhooks": {
        "guilds": "URL", 
        "suggestions": "URL", 
        "issues": "URL",
        "dbl": "URL"
    }
  }
```
<br>

## ✨ | Install all required dependencies
```bash
npm i
```

## 💻 | Compiling Foxy

Just type:

```bash
tsc
```

<br>

<p>Check the console to see if there are any errors... Well, we hope that there are none.</p>

## 🤩 | Starting Foxy
- You need to register slash commands running: npm run register

Now you can run Foxy using:
```bash
node .
```