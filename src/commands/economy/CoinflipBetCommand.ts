import Command from '../../structures/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';

export default class CoinflipBetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bet',
            description: 'Bet on a coinflip',
            category: 'economy',
            dev: false,
            data: new SlashCommandBuilder()
                .setName('bet')
                .setDescription('[💰 Economy] Bet on a coinflip')
                .addUserOption(user => user.setName("user").setDescription("The user to bet on").setRequired(true))
                .addNumberOption(number => number.setName("amount").setDescription("The amount to bet").setRequired(true))
        });
    }

    async execute(interaction, t) {
        const user = interaction.options.getUser("user");
        const userData = await this.client.database.getUser(interaction.user.id);
        const value: number = interaction.options.getNumber("amount");

        if (user == interaction.user) return interaction.editReply(t('commands:bet.self'));

        const mentionData = await this.client.database.getUser(user.id);

        const userBal = await userData.balance;
        const mentionBal = await mentionData.balance;

        if(userBal < value) {
            return interaction.editReply(t('commands:bet.not-enough', { amount: `${value}`, user: interaction.user.username }));
        }

        if(mentionBal < value) {
            return interaction.editReply(t('commands:bet.not-enough-mention', { amount: `${value}`, user: user.username }));
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder(t('commands:bet.placeholder'))
                    .addOptions([
                        {
                            label: t('commands:bet.heads'),
                            value: 'heads'
                        },

                        {
                            label: t('commands:bet.tails'),
                            value: 'tails'
                        }
                    ])
            )

        const buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel(t('commands:bet.accept'))
                    .setStyle('SUCCESS')
                    .setCustomId('accept')
            )

        const filter = (choice, user) => user.id === interaction.user.id && interaction.customId === 'select';
        const menuCollector = interaction.channel.createMessageComponentCollector(filter, { max: 1 });

        interaction.followUp({ content: t('commands:bet.choose'), components: [row], ephemeral: true });

        menuCollector.on('collect', async i => {
            interaction.followUp({ content: t('commands:bet.ask', { user: `<@!${user.id}>`, author: interaction.user.username, amount: `${value}` }), components: [buttonRow] });
            var selectmenu = i.values[0];
            i.deferUpdate();
            menuCollector.stop();

            const resultFilter = (user) => user.id === interaction.user.id && interaction.customId === 'accept';
            const resultCollector = interaction.channel.createMessageComponentCollector(resultFilter, { max: 1 });

            resultCollector.on('collect', async i => {
                let choices = ['heads', 'tails'];
                const rand = Math.floor(Math.random() * choices.length);

                if (selectmenu === choices[rand]) {
                    interaction.followUp({ content: t('commands:bet.win', { user: user.username, author: interaction.user.username, choice: t(`commands:bet.${choices[rand]}`), amount: `${value}` }) });
                    userData.balance += value;
                    mentionData.balance -= value;
                    userData.save();
                    mentionData.save();
                    i.deferUpdate();
                    resultCollector.stop();

                } else if (selectmenu !== choices[rand]) {
                    interaction.followUp({ content: t('commands:bet.lose', { user: user.username, author: interaction.user.username, choice: t(`commands:bet.${choices[rand]}`), amount: `${value}` }) });
                    userData.balance -= value;
                    mentionData.balance += value;
                    userData.save();
                    mentionData.save();
                    i.deferUpdate();
                    resultCollector.stop();
                }
            })
        });
    }
}