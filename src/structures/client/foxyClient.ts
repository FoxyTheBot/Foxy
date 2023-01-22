import { Bot, Collection, handleInteractionCreate, startBot } from 'discordeno';
import config from '../../../config.json';
import * as fs from 'fs';
import client from '../../FoxyClient';
import ClientOptions from '../types/client';
import express, { Application } from 'express';
import i18next from 'i18next';
import i18nbackend from 'i18next-fs-backend';
import { updateApplicationCommands } from '../commands/CommandManager';

export default async function setupClient(client, options: ClientOptions) {
    client.ownerId = BigInt(config.ownerId);
    client.clientId = BigInt(config.clientId);
    client.commands = new Collection();
    console.info("[READY] Client setup complete! Now loading functions...");
    await loadLocales(options.localesPath);
    await updateApplicationCommands();
    startServer(8080)
    setTimeout(() => {
        console.info("[GATEWAY] - Connecting to Discord Gateway...");
        startBot(client);
    });


}

async function loadCommands(path) {
    console.info("[COMMANDS] - Loading commands...")
    const commandFolders = fs.readdirSync(path);
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(path + `/${folder}`);
        for (const file of commandFiles) {
            const commandFile = await import(`${path}/${folder}/${file}`);
            var command = new commandFile.default(client);
            client.commands.set(command.config.name, command);
        }
    }
    console.info(`[COMMANDS] - Loaded ${client.commands.size} commands!`);
}

function startServer(port: Number): void {
    const app: Application = express();
    console.info("[SERVER] - Starting web server...")
    app.use('/', require('../server/routes/FileControl'));
    app.listen(port, () => {
        console.info(`[SERVER] - Server is running http://localhost:${port}`)
    });
}


async function loadLocales(path: string): Promise<void> {
    try {
        console.info("[LOCALES] - Loading locales...")
        await i18next.use(i18nbackend).init({
            ns: ["commands", "events", "permissions", "subscription"],
            defaultNS: "commands",
            preload: fs.readdirSync(path),
            fallbackLng: "pt-BR",
            backend: { loadPath: `${path}/{{lng}}/{{ns}}.json` },
            interpolation: {
                escapeValue: false,
                useRawValueToEscape: true
            },
            returnEmptyString: false,
            returnObjects: true
        });
        return console.info(`[LOCALES] - Loaded ${i18next.languages.length} languages!`);
    } catch (error) {
        return console.error(`[LOCALES] - failed to load locales: `, error);
    }
}

