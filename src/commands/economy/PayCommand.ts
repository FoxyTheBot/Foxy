import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";

export default class PayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "pay",
            description: "Pay someone",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("pay")
                .setDescription("[💰 Economy] Pay someone")
                .addNumberOption(option => option.setName("amount").setRequired(true).setDescription("Value to pay"))
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to pay"))
        });
    }

    async execute(interaction, t) {
        const amount: number = interaction.options.getNumber('amount');
        const user: any = interaction.options.getUser('user');
        const userData = await this.client.database.getUser(user.id);
        const authorData = await this.client.database.getUser(interaction.user.id);
        const coins = amount;
        const value = Math.round(coins);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel(t('commands:pay.pay'))
                    .setCustomId('pay')
                    .setStyle('SUCCESS')
            )

        if (user === interaction.user) return interaction.editReply(t('commands:pay.self'));

        await interaction.editReply({ content: t('commands:pay.alert', { amount: value.toString(), user: user.username }), components: [row] });

        const filter = i => i.customId === 'pay' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 60000 });

        collector.on('collect', async i => {
            i.deferUpdate();
            interaction.followUp(t('commands:pay.success', { user: user.tag, amount: value.toString() }));
            userData.balance += value;
            authorData.balance -= value;
            userData.save();
            authorData.save();
            collector.stop();
        });

    }
}