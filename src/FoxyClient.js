const { Client, Collection } = require("discord.js");
const fs = require("fs");
const DatabaseConnection = require("./structures/databaseConnection");
const WebhookManager = require("./structures/WebhookManager");

module.exports = class FoxyClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.emotes = require("./structures/emotes.json");
        this.config = require("../config.json");
        this.database = new DatabaseConnection(this.config.mongouri, { useNewUrlParser: true, useUnifiedTopology: true, writeConcern: "majority" }, this);
        this.WebhookManager = new WebhookManager(this);
    }

    login(token) {
        super.login(token);
    }

    loadCommands(path) {
        const commandFolders = fs.readdirSync(path);
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path + `/${folder}`);
            for (const file of commandFiles) {
                const command = new (require(path + `/${folder}/${file}`))(this);
                this.commands.set(command.config.name, command);
                console.log(command.config.name)
            }
        }
    }

    loadEvents(path) {
        const eventFiles = fs.readdirSync(path).filter(file => file.endsWith("js"));
        for (const file of eventFiles) {
            const event = new (require(`${path}/${file}`))(this);
            const eventBind = file.split(".")[0];
            console.info(`\x1b[37m\x1b[44mINFO\x1b[0m: Loading event: ${file}; Bind: ${eventBind}`);
            this.on(eventBind, (...args) => event.run(...args));
        }
        return this;
    }
}