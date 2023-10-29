import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createActionRow, createCustomId, createButton, createSelectMenu } from "../../../discord/Component";
import { MessageFlags } from '../../../discord/Message';
import { ButtonStyles } from "discordeno/types";

const MaskBuyExecutor = async (context: ComponentInteractionContext) => {
    const [code, mask, subCommand] = context.sentData;

    const userData = await bot.database.getUser(context.author.id);
    const clientData = await bot.database.getUser(bot.id);

    switch (userData.premiumType) {
        case '2': {
            const discount = (20 / 100) * Number(mask);
            const price = Number(mask) - discount;

            if (userData.balance < price) {
                context.followUp({
                    content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:masks.buy.noMoney')),
                    flags: MessageFlags.EPHEMERAL
                });
            } else {
                userData.balance -= price;
                clientData.balance += price;
                userData.mask = code;
                userData.masks.push(code);
                userData.transactions.push({
                    to: bot.id,
                    from: context.author.id,
                    quantity: price,
                    date: Date.now(),
                    received: false,
                    type: 'store'
                });
                await userData.save();
                context.sendReply({
                    content: bot.locale('commands:masks.buy.success'),
                    flags: MessageFlags.EPHEMERAL,
                    components: [createActionRow([createButton({
                        customId: createCustomId(1, context.author.id, context.commandId, code, price, subCommand),
                        label: bot.locale('commands:masks.buy.premium2'),
                        style: ButtonStyles.Secondary,
                        emoji: {
                            id: bot.emotes.FOXY_DAILY
                        },
                        disabled: true
                    })])]
                });
            }

            break;
        }

        case '3': {
            userData.mask = code;
            userData.masks.push(code);
            await userData.save();

            context.sendReply({
                content: bot.locale('commands:masks.buy.success'),
                flags: MessageFlags.EPHEMERAL,
                components: [createActionRow([createButton({
                    customId: createCustomId(1, context.author.id, context.commandId, code, mask, subCommand),
                    label: bot.locale('commands:masks.buy.premium3'),
                    style: ButtonStyles.Secondary,
                    emoji: {
                        id: bot.emotes.FOXY_DAILY
                    },
                    disabled: true
                })])]
            });
            break;
        }

        default: {
            if (userData.balance < mask) {
                context.followUp({
                    content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:masks.buy.noMoney')),
                    flags: MessageFlags.EPHEMERAL
                });
            } else {
                userData.balance -= Number(mask);
                clientData.balance += Number(mask);
                userData.mask = code;
                userData.masks.push(code);
                userData.transactions.push({
                    to: bot.id,
                    from: context.author.id,
                    quantity: Number(mask),
                    date: Date.now(),
                    received: false,
                    type: 'store'
                });
                await userData.save();
                context.sendReply({
                    content: bot.locale('commands:masks.buy.success'),
                    flags: MessageFlags.EPHEMERAL,
                    components: [createActionRow([createButton({
                        customId: createCustomId(1, context.author.id, context.commandId, code, mask, subCommand),
                        label: bot.locale('commands:masks.buy.purchase'),
                        style: ButtonStyles.Secondary,
                        emoji: {
                            id: bot.emotes.FOXY_DAILY
                        },
                        disabled: true
                    })])]
                });
            }
            break;
        }
    }
}

export default MaskBuyExecutor;