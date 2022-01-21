import { Client, Collection } from 'discord.js';
import * as fs from 'fs';
import { FoxyCommand } from './structures/BaseCommand';
import DatabaseConnection from './structures/DatabaseConnection';
import WebhookManager from './structures/WebhookManager';
import Config from './structures/Config';

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

    async loadCommands(path: string): Promise<void> {
        const commandFolders = fs.readdirSync(path);
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path + `/${folder}`);
            for (const file of commandFiles) {
                const commandFile = await import(`${path}/${folder}/${file}`);
                const command = new commandFile.default(this);
                console.info(`[SLASH] - Carregando ${command.config.name}`);
                this.commands.set(command.config.name, command);
            }
        }
    }

    async loadEvents(path: string): Promise<any> {
        const eventFiles = fs.readdirSync(path);
        for (const file of eventFiles) {
            const eventFile = await import(`${path}/${file}`);
            const event = new eventFile.default(this);
            console.info(`Loading event: ${file.split(".")[0]}`);
            this.on(file.split(".")[0], (...args) => event.run(...args));
        }
        return this;
    }
}