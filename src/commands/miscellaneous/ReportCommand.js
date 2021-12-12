const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class ReportCommand extends Command {
    constructor(client) {
        super(client, {
            name: "report",
            category: "misc",
            data: new SlashCommandBuilder()
            .setName("report")
            .setDescription("Reporte algum problema para o meu desenvolvedor")
            .addStringOption(option => option.setName("problema").setDescription("The issue to send").setRequired(true))
        })
    }

    async execute(interaction) {
        const content = interaction.options.getString("problema");
        this.client.WebhookManager.sendIssue(interaction, content);
        await interaction.reply({ content: `${this.client.emotes.success} **|** Obrigada ${interaction.user} seu problema: \`${content}\` foi enviado para o meu desenvolvedor`, ephemeral: true});
    }
}