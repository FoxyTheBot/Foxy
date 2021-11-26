const { Client, Collection } = require("discord.js");
const fs = require("fs");
const DatabaseConnection = require("./structures/databaseConnection");
const RegisterCommands = require("./structures/registerCommands");

module.exports = class FoxyClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.emotes = require("./structures/emotes.json")
        this.config = require("../config.json");
        this.database = new DatabaseConnection(this.config.uri, { useNewUrlParser: true, useUnifiedTopology: true, writeConcern: "majority" }, this);
        this.slashs = new RegisterCommands(this, "889918153931517983", this.config.token);
    }

    login(token) {
        super.login(token);
    }

    loadCommands() {
        const commandFolders = fs.readdirSync(`${global.dir}/src/commands/`);
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${global.dir}/src/commands/${folder}`);
            for (const file of commandFiles) {
                const command = new (require(`${global.dir}/src/commands/${folder}/${file}`))(this);
                const commandBind = file.toLowerCase().replace('command', '').split(".")[0];
                console.info(`[COMMANDS] - Comando ${command.config.name} carregado!`);
                this.commands.set(commandBind, command);
            }
        }
    }

    loadEvents() {
        const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith("js"));
        for (const file of eventFiles) {
            const event = new (require(`./events/${file}`))(this);
            const eventBind = file.split(".")[0];
            console.info(`[EVENTS] - ${eventBind} Carregado!`);
            this.on(eventBind, (...args) => event.run(...args));
        }
        return this;
    }

    registerCommands() {
        this.slashs.register();
    }
}