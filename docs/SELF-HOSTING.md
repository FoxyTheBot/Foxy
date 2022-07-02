## 🏗 | Preparing the environment

### 📕 | Terms:
You cannot use the Foxy's image in privates or public instances, Foxy is a public name but you **can't** use her image for any purposes, Foxy's images were created for **Foxy's use only**. The code in this repository is intended for Foxy contributors, If you want to run Foxy by yourself as self-host, you can, but WE DO NOT SUPPORT self-host.
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
  "ownerId": "<YOUR-ID>", // Insert your Discord Account ID
  "clientId": "<BOT-ID>", // Insert your bot ID
  "prefix": "<BOT-PREFIX>", // Insert the prefix (optional)
  "token": "<BOT-TOKEN>",  // Insert your bot token
  "mongouri": "<MONGODB-URI>", // Insert your mongoDB access URI
  "dblauth": "<TOPGG-AUTH>",  // Insert your Discord Bot List token (optional)

    "webhooks": {
        "guilds": "URL", // Insert your webhook url 
        "suggestions": "URL", // Insert your webhook url
        "issues": "URL",// Insert your webhook url
        "dbl": "URL" // Insert your webhook url
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
- You need to register slash commands running: node build/register.js

Now you can run Foxy using:
```bash
node .
```