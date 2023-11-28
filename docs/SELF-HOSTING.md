## 🏗 | Preparing the environment

### 📕 | Terms:
You cannot use the Foxy's image in privates or public instances, Foxy is a public name but you **can't** use her image for any purposes, Foxy's images were created for **Foxy's use only**. The code in this repository is intended for Foxy contributors, If you want to run Foxy by yourself as self-host, you can, but WE DO NOT SUPPORT self-host.
At your own risk

Pursuant to the license, you may modify Foxy's source code, but you are required to make the code public including the modifications.
<br>

### ⚠ | Requirements:

- NodeJS v17.x or higher (LTS Recommended)
- Git
- yarn
- TypeScript Compiler (tsc)
<br>

## 🤔 | How can I run Foxy?
<br>
<p>You need to install TypeScript Compiler (tsc)</p>

```bash
yarn global add typescript
```

## Values that you need to change
<br>

```json
{
  "ownerId": "<YOUR-DISCORD-ID>",
  "clientId": "<YOUR-BOT-ID>",
  "devGuildId": "<YOUR-SERVER-ID>",
  "serverURL": "https://cakey.foxybot.win",
  "productionEnv": false,
  "token": "<YOUR-BOT-TOKEN>",
  "mongouri": "<YOUR-MONGODB-URI>",
  "dblauth": "<YOUR-TOPGG-TOKEN",
  "webhooks": {
    "guilds": {
      "id": "<WEBHOOK-ID>",
      "token": "<WEBHOOK-TOKEN>"
    },
    "event_log": {
      "id": "1168290259205902396",
      "token": "xiwCu-4ZiZeVGtMDbqDj7CTzPzQ0S72CDa-m4un3dSonFYALUEsWQF6Tt5vomM9z1EL4"
    }
  }
}
```
<br>

## ✨ | Install all required dependencies
Just type `yarn` in the root folder

## 💻 | Compiling Foxy
- If you want to compile only Foxy client, type: `yarn build:client`
<br>

<p>Check the console to see if there are any errors... Well, we hope that there are none.</p>

## 🤩 | Starting Foxy
- In your terminal, start the Foxy Client: `yarn run:client`
