import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class AtmCommand extends Command {
    constructor(client) {
        super(client, {
            name: "atm",
            description: "View your balance",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("atm")
                .setDescription("[💰 Economy] View your balance")
                .addUserOption(option => option.setName("user").setRequired(false).setDescription("User you want to view"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = await interaction.options.getUser('user') || interaction.user;
        if (!user) return interaction.editReply(t('commands:global.noUser'));
        const userData = await this.client.database.getUser(user.id);
        const balance = userData.balance;

        await interaction.editReply(t('commands:atm.success', { user: user.tag, balance: balance.toString() }));
    }
}