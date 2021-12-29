const Command = require('../../structures/Command');
const figlet = require('figlet');
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class AsciiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ascii',
            description: 'Mostra uma mensagem em ASCII art.',
            category: 'utils',
            data: new SlashCommandBuilder()
                .setName("ascii")
                .setDescription("[🛠 Utils] Mostra uma mensagem em ASCII art.")
                .addStringOption(option => option.setName("text").setRequired(true).setDescription("Texto para ser convertido em ASCII art."))
        });
    }

    async execute(interaction) {
        const string = interaction.options.getString("text");
        figlet.text(string, async (err, data) => {
            if(err) console.log(err)
            await interaction.editReply(`\`\`\`${data}\`\`\``);
        })
    }
}