import { Client, Collection } from 'discord.js';
import * as fs from 'fs';
import { FoxyCommand } from './structures/BaseCommand';
import DatabaseConnection from './structures/DatabaseConnection';
import WebhookManager from './structures/WebhookManager';
import Config from './structures/Config';
import i18next from "i18next";
import i18nbackend from "i18next-fs-backend";

export default class FoxyClient extends Client {
    public commands = new Collection<string, FoxyCommand>();
    public emotes: any;
    public config: Config;
    public database: any;
    public WebhookManager: any;

    constructor(options: any) {
        super(options);
        this.commands = new Collection();
        this.emotes = require("./structures/json/emotes.json");
        this.config = require("../config.json");
        this.database = new DatabaseConnection(this.config.mongouri, { useNewUrlParser: true, useUnifiedTopology: true, writeConcern: "majority" }, this);
        this.WebhookManager = new WebhookManager(this);
    }

    login(token: string): any {
        super.login(token);
    }

    async loadLocales(path: string) {
        try {
            await i18next.use(i18nbackend).init({
                ns: ["commands", "events", "permissions"],
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
            return console.info(`[LOCALES] - Carregados ${i18next.languages.length} locales`);
        } catch (error) {
            return console.error(`Erro ao carregar locales: `, error);
        }
    }

    async loadCommands(path: string): Promise<void> {
        const commandFolders = fs.readdirSync(path);
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path + `/${folder}`);
            for (const file of commandFiles) {
                const commandFile = await import(`${path}/${folder}/${file}`);
                const command = new commandFile.default(this);
                this.commands.set(command.config.name, command);
            }
        }
    }

    async loadEvents(path: string): Promise<any> {
        const eventFiles = fs.readdirSync(path);
        for (const file of eventFiles) {
            const eventFile = await import(`${path}/${file}`);
            const event = new eventFile.default(this);
            console.info(`[EVENTS] - Loaded ${file.split(".")[0]}`);
            this.on(file.split(".")[0], (...args) => event.run(...args));
        }
        return this;
    }
}