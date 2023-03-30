import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { User } from "discordeno/transformers";
import { bot } from "../..";
import BetExecutor from "../../utils/commands/executors/economy/BetExecutor";

const BetCommand = createCommand({
    name: "bet",
    nameLocalizations: {
        "pt-BR": "apostar"
    },
    description: "[Economy] Bet your cakes",
    descriptionLocalizations: {
        "pt-BR": "[Economy] Aposte seus cakes"
    },
    category: 'economy',
    options: [
        {
            name: "coinflip",
            nameLocalizations: {
                "pt-BR": "caracoroa"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            description: "[Economy] Bet your cakes on a coinflip",
            descriptionLocalizations: {
                "pt-BR": "[Economy] Aposte seus cakes em uma cara coroa"
            },

            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        "pt-BR": "usuário"
                    },
                    description: "The user you want to bet on",
                    descriptionLocalizations: {
                        "pt-BR": "O usuário que você deseja apostar"
                    },
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                },
                {
                    name: "amount",
                    nameLocalizations: {
                        "pt-BR": "quantidade"
                    },
                    description: "The amount of cakes you want to bet",
                    descriptionLocalizations: {
                        "pt-BR": "A quantidade de cakes que você deseja apostar"
                    },
                    type: ApplicationCommandOptionTypes.Integer,
                    required: true,
                    minValue: 1
                },
                {
                    name: "choice",
                    nameLocalizations: {
                        "pt-BR": "escolha"
                    },
                    description: "Select between head or tails",
                    descriptionLocalizations: {
                        "pt-BR": "Selecione entre cara ou coroa"
                    },
                    type: ApplicationCommandOptionTypes.String,
                    choices: [
                        {
                            name: "Heads",
                            nameLocalizations: {
                                "pt-BR": "Cara"
                            },
                            value: "heads"
                        },
                        {
                            name: "Tails",
                            nameLocalizations: {
                                "pt-BR": "Coroa"
                            },
                            value: "tails"
                        }
                    ],
                    required: true
                }
            ]
        }
    ],
    commandRelatedExecutions: [BetExecutor],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');
        const amount = context.getOption<Number>('amount', false);
        const choice = context.getOption<string>('choice', false);
        let choices = ['heads', 'tails'];
        const rand = Math.floor(Math.random() * choices.length);

        const userData = await bot.database.getUser(context.author.id);
        const mentionedUserData = await bot.database.getUser(user.id);

        if (user.id === context.author.id) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:bet.self')),
                flags: 64
            });
            return endCommand();
        }

        if (await userData.balance < amount) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:bet.not-enough', { amount: amount.toString(), user: context.author.username })),
                flags: 64

            });

            return endCommand();
        }

        if (await mentionedUserData.balance < amount) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:bet.not-enough-mention', { amount: amount.toString(), user: user.username })),
                flags: 64
            });

            return endCommand();
        }

        if (user.id === bot.id) {
            if (choice === choices[rand]) {
                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:bet.betWithClient.win', { user: context.author.username, result: t(`commands:bet.${choices[rand]}`), amount: amount.toString() })),
                    flags: 64
                });
                userData.balance += Number(amount);
                mentionedUserData.balance -= Number(amount);
                userData.save();
                mentionedUserData.save();

                return endCommand();

            } else if (choice !== choices[rand]) {
                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:bet.betWithClient.lose', { user: context.author.username, result: t(`commands:bet.${choices[rand]}`), amount: amount.toString() })),
                    flags: 64
                });
                userData.balance -= Number(amount);
                mentionedUserData.balance += Number(amount);
                userData.save();
                mentionedUserData.save();

                return endCommand();
            }
        } else {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_WOW, t('commands:bet.ask', { user: `<@!${user.id}>`, author: context.author.username, amount: amount.toString() })),
                components: [createActionRow([createButton({
                    label: t('commands:bet.accept'),
                    style: ButtonStyles.Success,
                    customId: createCustomId(0, user.id, context.commandId, user.username, user.id, amount, choice, "accept"),
                    emoji: {
                        id: bot.emotes.FOXY_WOW
                    }
                }),
                createButton({
                    label: t('commands:bet.deny'),
                    style: ButtonStyles.Danger,
                    customId: createCustomId(0, user.id, context.commandId, user.username, user.id, amount, choice, "deny"),
                    emoji: {
                        id: bot.emotes.FOXY_CRY
                    }
                })])]
            });

        }

        return endCommand();
    }
});

export default BetCommand;