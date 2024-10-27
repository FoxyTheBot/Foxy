### 📕 | Warning:
If you are here with the purpose to make a self-hosting version of Foxy, please check [our self-hosting guide](SELF-HOSTING.md)
<br>

## 🏗 | Preparing the environment

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

```
## Application settings
DEFAULT_PREFIX=YOUR-PREFIX
OWNER_ID=YOUR-DISCORD-ID
CLIENT_ID=YOUR-BOT-ID
DEV_GUILD_ID=BOT-SUPPORT-SERVER-ID
SERVER_URL=YOUR-BOT-API
PRODUCTION=false

## Default Authentication
DISCORD_TOKEN=YOUR-BOT-TOKEN
MONGO_URI=YOUR-MONGODB-URI

## API Keys
FOXY_API_TOKEN=YOUR-FOXY-API-INSTANCE-TOKEN
FOXY_LOCAL_API=YOUR-FOXY-LOCAL-API-INSTANCE-TOKEN
DBL_TOKEN=YOUR-DBL-TOKEN

## Webhooks
JOIN_GUILD_WEBHOOK_ID=YOUR-WEBHOOK
JOIN_GUILD_WEBHOOK_TOKEN=YOUR-WEBHOOK
EVENTS_WEBHOOK_ID=YOUR-WEBHOOK
EVENTS_WEBHOOK_TOKEN=YOUR-WEBHOOK
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
