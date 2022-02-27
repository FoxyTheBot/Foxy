import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class CancelCommand extends Command {
    constructor(client) {
        super(client, {
            name: "cancel",
            description: "Cancel a user",
            category: "fun",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("cancel")
                .setDescription("[🤖 Fun] Cancel a user")
                .addUserOption(option => option.setName("user").setDescription("User to cancel").setRequired(true))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = interaction.options.getUser("user");
        if(!user) return interaction.editReply(t('commands:global.noUser'));
        const string = interaction.options.getString("text");

        await interaction.editReply(t('commands:cancel.result', { user: user.username, reason: string, mention: `<@!${user.id}>` }));
    }
}