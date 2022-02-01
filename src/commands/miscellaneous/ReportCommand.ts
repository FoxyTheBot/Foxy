import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class ReportCommand extends Command {
    constructor(client) {
        super(client, {
            name: "report",
            description: "Report a bug",
            category: 'misc',
            dev: false,
            data: new SlashCommandBuilder()
                .setName("report")
                .setDescription("[🛠 Misc] Report a bug")
                .addStringOption(option => option.setName("issue").setRequired(true).setDescription("The issue you want to report"))
        });
    }

    async execute(interaction, t) {
        const content: string = interaction.options.getString("issue");
        this.client.WebhookManager.sendIssue(interaction, content);
        await interaction.editReply(t('commands:report.success', { content: content, user: interaction.user }));
    }
}