import { Client, ClientOptions, Collection } from 'discord.js';
import { FoxyCommands } from './structures/BaseCommand';
import { FoxySettings } from './structures/ClientSettings';
import DatabaseConnection from './structures/DatabaseConnection';
import WebhookManager from './structures/WebhookManager';
import i18next from "i18next";
import i18nbackend from "i18next-fs-backend";
import * as fs from 'fs';

export default class FoxyClient extends Client {
    public commands = new Collection<string, FoxyCommands>();
    public emotes: Object;
    public database: Object;
    public WebhookManager: Object;
    public config: FoxySettings;
  
    constructor(options: ClientOptions) {
        super(options );
        this.commands = new Collection();
        this.emotes = require("./structures/json/emotes.json");
        this.config = require("../config.json");
        this.database = new DatabaseConnection(this.config.mongouri, { useNewUrlParser: true, useUnifiedTopology: true, writeConcern: "majority" }, this);
        this.WebhookManager = new WebhookManager(this);
    }

    login(token: string): any {
        super.login(token);
    }

    async loadLocales(path: string): Promise<void> {
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