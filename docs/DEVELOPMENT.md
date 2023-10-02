### 📕 | Warning:
If you are here with the purpose to make a self-hosting version of Foxy, please check [our self-hosting guide](SELF-HOSTING.md)
<br>

## 🏗 | Preparing the environment

### ⚠ | Requirements:

- NodeJS v17.x or higher (v18.x Recommended)
- Git
- yarn

<br>

## 🤔 | How can I run Foxy?
<br>
<p>You need to install TSC (TypeScript Compiler)</p>

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
    "serverURL": "http://localhost:8080",
    "productionEnv": true, // This bool will determine if you're using experimental version
    "token": "<YOUR-BOT-TOKEN>",
    "mongouri": "<YOUR-MONGODB-URI>",
    "dblauth": "<YOUR-TOPGG-TOKEN",
    "webhooks": {
        "guilds": {
            "id": "<WEBHOOK-ID>",
            "token": "<WEBHOOK-TOKEN>"
        }
    }
}
```
<br>

## ✨ | Install all required dependencies
Just type `yarn` in the root folder

## 💻 | Compiling Foxy

- If you want to compile only server, type: `yarn build:server`
- If you want to compile only Foxy client, type: `yarn build:client`

- To build all, type: `yarn build:all`

<br>

<p>Check the console to see if there are any errors... Well, we hope that there are none.</p>

## 🤩 | Starting Foxy
- First of all you need to start two terminals one for client and another one for server

- In the first terminal you start the Foxy Web Server (Not the website): `yarn run:server`
- In the second terminal you start the Foxy Client: `yarn run:client`

⚠ **You can run only the client, but some commands may not work properly and result in errors**
