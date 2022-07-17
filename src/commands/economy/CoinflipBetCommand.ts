import Command from '../../structures/command/BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle } from 'discord.js';

export default class CoinflipBetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bet',
            description: 'Bet on a coinflip',
            category: 'economy',
            dev: false,
            data: new SlashCommandBuilder()
                .setName('bet')
                .setDescription('[Economy] Bet on a coinflip')
                .addUserOption(user => user.setName("user").setDescription("The user to bet on").setRequired(true))
                .addNumberOption(number => number.setName("amount").setDescription("The amount to bet").setRequired(true))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        const userData = await this.client.database.getUser(interaction.user.id);
        const value: number = interaction.options.getNumber("amount");

        if (user == interaction.user) return interaction.reply(t('commands:bet.self'));

        const mentionData = await this.client.database.getUser(user.id);

        const userBal = await userData.balance;
        const mentionBal = await mentionData.balance;

        if (userBal < value) {
            return interaction.reply(t('commands:bet.not-enough', { amount: `${value}`, user: interaction.user.username }));
        }

        if (mentionBal < value) {
            return interaction.reply(t('commands:bet.not-enough-mention', { amount: `${value}`, user: user.username }));
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
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

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(t('commands:bet.accept'))
                    .setStyle(ButtonStyle.Success)
                    .setCustomId('accept')
            )

        const filter = (i, choice, user) => user.id === user.id && interaction.customId === 'select' && i.message.id === interaction.message.id;
        const menuCollector = interaction.channel.createMessageComponentCollector(filter, { max: 1 });

        interaction.followUp({ content: t('commands:bet.choose'), components: [row], ephemeral: true });

        menuCollector.on('collect', async i => {
            interaction.followUp({ content: t('commands:bet.ask', { user: `<@!${user.id}>`, author: interaction.user.username, amount: `${value}` }), components: [buttonRow] });
            const selectMenu = i.values[0];
            i.deferUpdate();
            menuCollector.stop();

            const resultFilter = (user) => user.id === user.id && interaction.customId === 'accept';
            const resultCollector = interaction.channel.createMessageComponentCollector(resultFilter, { max: 1 });

            resultCollector.on('collect', async i => {
                if (i.customId === 'accept') {
                    let choices = ['heads', 'tails'];
                    const rand = Math.floor(Math.random() * choices.length);

                    if (selectMenu === choices[rand]) {
                        interaction.followUp({ content: t('commands:bet.win', { user: user.username, author: interaction.user.username, choice: t(`commands:bet.${choices[rand]}`), amount: `${value}` }) });
                        userData.balance += value;
                        mentionData.balance -= value;
                        userData.save();
                        mentionData.save();
                        i.deferUpdate();
                        resultCollector.stop();

                    } else if (selectMenu !== choices[rand]) {
                        interaction.followUp({ content: t('commands:bet.lose', { user: user.username, author: interaction.user.username, choice: t(`commands:bet.${choices[rand]}`), amount: `${value}` }) });
                        userData.balance -= value;
                        mentionData.balance += value;
                        userData.save();
                        mentionData.save();
                        i.deferUpdate();
                        resultCollector.stop();
                    }
                }
            })
        });
    }
}