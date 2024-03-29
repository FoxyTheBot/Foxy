import { bot } from "../../index";
import { createCommand } from "../../structures/commands/createCommand";
import { createButton, createCustomId, createActionRow } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { User } from "discordeno/transformers";
import MarryExecutor from "../../utils/commands/executors/social/MarryExecutor";
import { MessageFlags } from "../../utils/discord/Message";

const MarryCommand = createCommand({
    name: 'marry',
    nameLocalizations: {
        "pt-BR": "casar"
    },
    description: "[Social] Marry your partner",
    descriptionLocalizations: {
        "pt-BR": "[Social] Case-se com seu parceiro(a)"
    },
    options: [{
        name: "ask",
        nameLocalizations: {
            "pt-BR": "pedir"
        },
        description: "[Social] Ask someone to marry you",
        descriptionLocalizations: {
            "pt-BR": "[Social] Peça alguém em casamento"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário",
            },
            description: "[Social] User you want to marry",
            descriptionLocalizations: {
                "pt-BR": "[Social] Usuário que você deseja casar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }]
    },
    {
        name: "lock_requests",
        nameLocalizations: {
            "pt-BR": "bloquear_pedidos",
        },
        description: "[Social] Lock marriage requests",
        descriptionLocalizations: {
            "pt-BR": "[Social] Bloqueie pedidos de casamento"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "lock",
            nameLocalizations: {
                "pt-BR": "bloquear",
            },
            description: "[Social] Lock marriage requests",
            descriptionLocalizations: {
                "pt-BR": "[Social] Bloqueie pedidos de casamento"
            },
            type: ApplicationCommandOptionTypes.Boolean,
            required: true
        }]
    }
    ],
    category: "social",
    commandRelatedExecutions: [MarryExecutor],

    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');
        const subCommand = context.getSubCommand();

        switch (subCommand) {
            case "ask": {
                if (!user) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
                    })
                    return endCommand();
                }

                if (user.id === context.author.id) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.self'))
                    })
                    return endCommand();
                }

                if (user.id === bot.id) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.bot'))
                    })
                    return endCommand();
                }

                const userData = await bot.database.getUser(context.author.id);
                const futurePartnerData = await bot.database.getUser(user.id);

                if (futurePartnerData.marriedWith) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarriedWithSomeone'))
                    })
                    return endCommand();
                }

                if (futurePartnerData.cantMarry) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.userNotMarriable', { user: await bot.foxyRest.getUserDisplayName(user.id) }))
                    })
                    return endCommand();
                }

                if (userData.cantMarry) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.authorNotMarriable'))
                    })
                    return endCommand();
                }

                if (userData.marriedWith) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarried'))
                    })
                    return endCommand();
                }

                if (user.id === userData.marriedWith) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarriedWithUser', { user: await bot.foxyRest.getUserDisplayName(user.id) }))
                    })
                    return endCommand();
                }

                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:marry.ask', { user: await bot.foxyRest.getUserDisplayName(user.id), author: await bot.foxyRest.getUserDisplayName(context.author.id) })),
                    components: [createActionRow([createButton({
                        customId: createCustomId(0, user.id, context.commandId),
                        label: t('commands:marry.accept'),
                        emoji: {
                            name: "💍"
                        },
                        style: ButtonStyles.Success
                    })])],
                });

                endCommand();
                break;
            }

            case "lock_requests": {
                const status = context.getOption<boolean>('lock', false);
                const userData = await bot.database.getUser(context.author.id);

                if (userData.cantMarry) {
                    context.sendReply({
                        content: t('commands:profile.marriableStatusAlreadySet', { status: status ? t('commands:profile.simpleYes') : t('commands:profile.simpleNo') }),
                        flags: MessageFlags.EPHEMERAL
                    });
                    return endCommand();
                } else {
                    userData.cantMarry = status;
                    await userData.save();

                    context.sendReply({
                        content: t('commands:profile.marriableStatusSet', { status: status ? t('commands:profile.yes') : t('commands:profile.no') }),
                        flags: MessageFlags.EPHEMERAL
                    });

                    endCommand();
                    break;
                }
            }
        }
    }
});

export default MarryCommand;