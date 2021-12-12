const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class SuggestCommand extends Command {
    constructor(client) {
        super(client, {
            name: "suggest",
            description: "Envia um sugestão para o desenvolvedor.",
            category: "misc",
            data: new SlashCommandBuilder()
                .setName("suggest")
                .setDescription("Envia um sugestão para o desenvolvedor.")
                .addStringOption(option => option.setName("suggestion").setRequired(true).setDescription("A sugestão."))
        })
    }

    async execute(interaction) {
        const suggestion = interaction.options.getString("suggestion");
        this.client.WebhookManager.sendSuggestion(interaction, suggestion);
        await interaction.reply(`Obrigada por me ajudar ${interaction.user}, sua sugestão foi enviada com sucesso! <:meow_blush:768292358458179595>`)
    }
}