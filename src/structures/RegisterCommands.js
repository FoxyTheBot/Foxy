const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = class RegisterCommands {
    constructor(client, clientId, token) {
        this.client = client;
        this.clientId = clientId;
        this.token = token;
    }

    async register() {
        const commands = [];
        const commandFolders = fs.readdirSync(`${global.dir}/src/commands/`);

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(global.dir + `/src/commands/${folder}`);
            for (const file of commandFiles) {
                const command = new (require(global.dir + `/src/commands/${folder}/${file}`))(this);
                console.info('[' + color("SLASH", 34) + '] ' +`Carregando ${command.config.data.name}`);
                commands.push(command.config.data.toJSON());
            }
        }

        const rest = new REST({ version: '9' }).setToken(this.token);

        (async () => {
            try {
                console.info('[' + color("REGISTER", 33) + '] ' +"Registrando comandos...");

                await rest.put(
                    Routes.applicationCommands(this.clientId),
                    // Se quiser registrar comandos em um servidor específico, basta trocar a função applicationCommands(this.clientId) para applicationGuildCommands(this.clientId, "Id do servidor")
                    { body: commands },
                );

                console.info('[' + color("READY", 32) + '] ' +"Comandos atualizados!");
                process.exit(1);
            } catch (error) {
                console.error(error);
            }
        })()
    }
}