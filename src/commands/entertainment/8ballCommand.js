const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class EightBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: "8ball",
            category: "image",
            data: new SlashCommandBuilder()
            .setName("8ball")
            .setDescription("[✨ Entertainment] Não sou um oráculo, mas posso te responder algumas coisas")
            .addStringOption(option => option.setName("pergunta").setDescription("Sua pergunta").setRequired(true))
        });
    }

    async execute(interaction) {
        const results = ['Sim', 'Não', 'Talvez', 'Com certeza!', 'Provavelmente sim', 'Provavelmente não', 'Não entendi, pergunte novamente'];
        const result = results[Math.floor(Math.random() * results.length)];

        await interaction.editReply(result)
    }
}