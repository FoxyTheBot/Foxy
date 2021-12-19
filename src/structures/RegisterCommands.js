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
                console.info(`[SLASH] - Carregando ${command.config.data.name}`);
                commands.push(command.config.data.toJSON());
            }
        }

        const rest = new REST({ version: '9' }).setToken(this.token);

        (async () => {
            try {
                console.info("[SLASH] - Registrando comandos...");

                await rest.put(
                    Routes.applicationCommands(this.clientId),
                    // Se quiser registrar comandos globais troque "apllicationGuildCommands(this.clientId, "id do servidor")" para "applicationCommands(this.clientId)"
                    { body: commands },
                );

                console.info("[SLASH] - Comandos atualizados!");
                process.exit(1);
            } catch (error) {
                console.error(error);
            }
        })()
    }
}