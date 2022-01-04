const { Client, Collection } = require("discord.js");
const fs = require("fs");
const DatabaseConnection = require("./structures/databaseConnection");
const WebhookManager = require("./structures/WebhookManager");
const PizzariaSimulator = require("./structures/PizzariaSimulator");

module.exports = class FoxyClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.emotes = require("./structures/json/emotes.json");
        this.config = require("../config.json");
        this.database = new DatabaseConnection(this.config.mongouri, { useNewUrlParser: true, useUnifiedTopology: true, writeConcern: "majority" }, this);
        this.WebhookManager = new WebhookManager(this);
        this.simulator = new PizzariaSimulator(this);
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
            }
        }
    }

    loadEvents(path) {
        const eventFiles = fs.readdirSync(path).filter(file => file.endsWith("js"));
        for (const file of eventFiles) {
            const event = new (require(`${path}/${file}`))(this);
            console.info('[' + color("EVENTS", 34) + ']' + ` Loading event: ${file.split(".")[0]}`);
            this.on(file.split(".")[0], (...args) => event.run(...args));
        }
        return this;
    }
}

global.color = (s, c) => {
    if (process.stdout.isTTY) {
        return `\x1B[${c}m${s}\x1B[0m`;
    }
    return s;
}