const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('../config.json');
const fs = require('fs');

const commands = [];
const commandFolders = fs.readdirSync('./src/commands');

const clientId = '772554697298673677';

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        console.log(`[SLASH] - Comando ${command.data.name} foi carregado`)
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('[SLASH] - Atualizando os comandos');

        await rest.put(
            Routes.applicationGuildCommands(clientId, "810597092993007646"),
            { body: commands },
        );

        console.log('[SLASH] - Comandos atualizados');
    } catch (error) {
        console.error(error);
    }
})();