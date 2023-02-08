import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../../index";
import { User } from "discordeno/transformers";
import { ButtonStyles } from "discordeno/types";
import executePawsTransfer from "../../structures/commands/modules/executePawsTransfer";

const PawsCommand = createCommand({
    path: '',
    name: 'paws',
    description: 'Veja suas paws',
    descriptionLocalizations: {
        'en-US': 'See your paws'
    },
    options: [
        {
            name: "atm",
            description: "[💵] Veja a sua quantidade de paws",
            descriptionLocalizations: {
                'en-US': "[💵] See your amount of paws"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        'pt-BR': "usuário"
                    },
                    description: "Veja a quantidade de paws de outro usuário",
                    descriptionLocalizations: {
                        'en-US': "See the amount of paws of another user"
                    },
                    type: ApplicationCommandOptionTypes.User,
                    required: false
                }
            ]
        },
        {
            name: "rank",
            description: "[💵] Veja o rank de paws",
            descriptionLocalizations: {
                'en-US': "[💵] See the paws rank"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
            name: "transfer",
            nameLocalizations: {
                'pt-BR': "transferir"
            },
            description: "[💵] Envie paws para outra pessoa",
            descriptionLocalizations: {
                'en-US': "[💵] Transfer paws to another person"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        'pt-BR': "usuário"
                    },
                    description: "Usuário que você quer transferir",
                    descriptionLocalizations: {
                        'en-US': "User you want to transfer"
                    },
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                },
                {
                    name: "amount",
                    nameLocalizations: {
                        'pt-BR': "quantidade"
                    },
                    description: "Quantidade de paws que você quer transferir",
                    descriptionLocalizations: {
                        'en-US': "Amount of paws you want to transfer"
                    },
                    type: ApplicationCommandOptionTypes.Number,
                    required: true
                }
            ]
        }
    ],
    authorDataFields: [],
    commandRelatedExecutions: [executePawsTransfer],
    category: 'economy',
    execute: async (ctx, finishCommand, t) => {
        switch (ctx.getSubCommand()) {
            case "atm": {
                const user = await ctx.getOption<User>('user', 'users') ?? ctx.author;
                if (!user) {
                    ctx.foxyReply({
                        content: ctx.makeReply(bot.emotes.error, t('commands:global.noUser'))
                    });
                    return finishCommand();
                }
                const userData = await bot.database.getUser(user.id);
                const balance = userData.balance;

                ctx.foxyReply({
                    content: ctx.makeReply(bot.emotes.daily, t('commands:atm.success', { user: user.username, balance: balance.toString() }))
                })
                finishCommand();
                break;
            }

            case "rank": {
                let data = await bot.database.getAllUsers();
                await ctx.defer();
                data = data.sort((a, b) => b.balance - a.balance);
                let position = parseInt(data.map(m => m._id).indexOf(ctx.author.id)) + 1;

                const embed = createEmbed({});
                embed.title = ctx.makeReply(bot.emotes.daily, "Paws Global Rank");
                embed.description = ctx.makeReply(bot.emotes.sunglass, ` ${t('commands:rank.youAreIn')} ${`${position}º` || 'Sad™'} ${t('commands:rank.position')}`)
                let fields = embed.fields = [];
                for (let i in data) {
                    if (Number(i) > 14) break;
                    let user = await bot.helpers.getUser(data[i]._id);
                    fields.push({
                        name: `${parseInt(data.map(m => m._id).indexOf(data[i]._id)) + 1}º - \`${user.username}\``,
                        value: `**${parseInt(data[i].balance)}** Paws`,
                        inline: true,
                    });
                }

                ctx.foxyReply({
                    embeds: [embed],
                });

                finishCommand();
                break;
            }
            case "transfer": {
                const user = await ctx.getOption<User>('user', 'users');
                const amount = await ctx.getOption<number>('amount', false);
                if (!user) {
                    ctx.foxyReply({
                        content: ctx.makeReply(bot.emotes.error, t('commands:global.noUser'))
                    });
                    return finishCommand();
                }

                const authorData = await bot.database.getUser(ctx.author.id);
                const coins = amount;

                const value = Math.round(coins);

                if (user === ctx.author) {
                    ctx.foxyReply({
                        content: ctx.makeReply(bot.emotes.error, t('commands:pay.self'))
                    })
                    return finishCommand();
                }
                if (value > authorData.balance) {
                    ctx.foxyReply({
                        content: ctx.makeReply(bot.emotes.error, t('commands:pay.notEnough'))
                    })
                    return finishCommand();
                }


                ctx.foxyReply({
                    content: ctx.makeReply("🦊", t('commands:pay.alert', { amount: value.toString(), user: user.username })),
                    components: [createActionRow([createButton({
                        label: t('commands:pay.pay'),
                        style: ButtonStyles.Success,
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, value, user.id)
                    })])]
                });
                finishCommand();
                break;
            }
        }
    }
});

export default PawsCommand;