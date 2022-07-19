import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class FoxCoins extends Command {
    constructor(client) {
        super(client, {
            name: "foxcoins",
            description: "Get your FoxCoins",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("foxcoins")
                .setDescription("[Economy] Subcommands for FoxCoins")
                .addSubcommand(subcommand => subcommand.setName("atm").setDescription("[Economy] See your FoxCoins").addUserOption(option => option.setName("user").setDescription("User you want to see the balance")))
                .addSubcommand(subcommand => subcommand.setName("rank").setDescription("[Economy] Get the FoxCoins rank"))
                .addSubcommand(subcommand => subcommand.setName("transfer").setDescription("[Economy] Transfer your FoxCoins to another user").addUserOption(option => option.setName("user").setDescription("User you want to transfer the balance").setRequired(true)).addNumberOption(option => option.setName("amount").setDescription("Amount of FoxCoins").setRequired(true)))
        });
    }

    async execute(ctx, t): Promise<void> {
        switch (ctx.options.getSubcommand()) {
            case 'atm': {
                const user = await ctx.options.getUser('user') || ctx.user;
                if (!user) return ctx.reply(t('commands:global.noUser'));
                const userData = await this.client.database.getUser(user.id);
                const balance = userData.balance;

                await ctx.reply(t('commands:atm.success', { user: user.username, balance: balance.toString() }));
                break;
            }

            case 'rank': {
                let data = await this.client.database.getAllUsers();
                await ctx.deferReply();
                const embed = new EmbedBuilder();

                data = data.sort((a, b) => b.balance - a.balance);
                let position = parseInt(data.map(m => m._id).indexOf(ctx.user.id)) + 1;

                embed.setTitle(`${this.client.emotes.daily} | FoxCoins Global Rank`)
                    .setColor('#5865F2')
                    .setDescription(`${this.client.emotes.sunglass} | ${t('commands:rank.youAreIn')} ${`${position}º` || 'Sad™'} ${t('commands:rank.position')}`)
                for (let i in data) {
                    if (Number(i) > 14) break;
                    let user = await this.client.users.fetch(data[i]._id);
                    embed.addFields([
                        {
                            name: `${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º - \`${user.tag}\``, value: `**${parseInt(data[i].balance)}** FoxCoins`, inline: true
                        },
                    ]);
                }
                await ctx.reply({ embeds: [embed] });
                break;
            }

            case 'transfer': {
                const amount: number = ctx.options.getNumber('amount');
                const user: any = ctx.options.getUser('user');
                if (!user) return ctx.reply(t('commands:global.noUser'));

                const userData = await this.client.database.getUser(user.id);
                const authorData = await this.client.database.getUser(ctx.user.id);
                const coins = amount;
                const value = Math.round(coins);
                if (user === ctx.user) return ctx.reply(t('commands:pay.self'));
                if (value !== authorData.balance) return ctx.reply(t('commands:pay.notEnough'))

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(t('commands:pay.pay'))
                            .setCustomId('transfer')
                            .setStyle(ButtonStyle.Success)
                            .setEmoji("<:foxydaily:915736630495686696>")
                    )

                if (user === ctx.user) return ctx.reply(t('commands:pay.self'));

                await ctx.reply({ content: t('commands:pay.alert', { amount: value.toString(), user: user.username }), components: [row] });

                const filter = i => i.customId === 'transfer' && i.user.id === ctx.user.id && i.message.id === ctx.message.id;
                const collector = await ctx.channel.createMessageComponentCollector(filter, { time: 15000 });

                collector.on('collect', async i => {
                    if (await ctx.getContext(i, 1)) {
                        if (i.customId === 'transfer') {
                            i.deferUpdate();
                            ctx.followUp(t('commands:pay.success', { user: user.tag, amount: value.toString() }));
                            userData.balance += value;
                            authorData.balance -= value;
                            userData.save();
                            authorData.save();
                            collector.stop();
                        }
                    } else {
                        i.deferUpdate();
                    }
                });
            }
        }
    }
}