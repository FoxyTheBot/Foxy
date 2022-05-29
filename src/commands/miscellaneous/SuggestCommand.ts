import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class SuggestCommand extends Command {
    constructor(client) {
        super(client, {
            name: "suggest",
            description: "Suggest something to the bot",
            category: "misc",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("suggest")
                .setDescription("[🛠 Misc] Suggest something to the bot")
                .addStringOption(option => option.setName("suggestion").setRequired(true).setDescription("The suggestion you want to send"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const content: string = interaction.options.getString("suggestion");
        this.client.WebhookManager.sendSuggestion(interaction, content);
        await interaction.reply(t('commands:suggest.success', { content: content, user: interaction.user }));
    }
}