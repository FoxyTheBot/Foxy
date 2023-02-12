import ComponentInteractionContext from "../ComponentInteractionContext";
import { bot } from "../../../index";
import { createActionRow, createCustomId, createButton, createSelectMenu } from "../../../utils/discord/Component";
import { MessageFlags } from '../../../utils/discord/Message';
import { ButtonStyles } from "discordeno/types";

const executeMaskBuy = async (ctx: ComponentInteractionContext) => {
    const [code, mask, subCommand] = ctx.sentData;
    if (subCommand === 'buy') {
        const userData = await bot.database.getUser(ctx.author.id);
        
        if (userData.balance < mask) {
            ctx.foxyReply({
                flags: MessageFlags.Ephemeral
            });
            ctx.followUp({
                content: ctx.makeReply(bot.emotes.cry, bot.locale('commands:masks.buy.noMoney')),
                flags: MessageFlags.Ephemeral
            });
        } else {
             userData.balance -= Number(mask);
             userData.mask = code;
             userData.masks.push(code);
             await userData.save();
             ctx.foxyReply({
                    content: bot.locale('commands:masks.buy.success'),
                    flags: MessageFlags.Ephemeral,
                    components: [createActionRow([createButton({
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, code, mask, subCommand),
                        label: bot.locale('commands:masks.buy.purchase'),
                        style: ButtonStyles.Secondary,
                        emoji: bot.emotes.daily,
                        disabled: true
                    })])]
             });
        }
    } else if (subCommand === 'set') {
        const choice = ctx.interaction.data.options[0].value;
        const userData = await bot.database.getUser(ctx.author.id);

        if (userData.masks.includes(choice)) {
            userData.mask = choice;
            userData.save();
            ctx.foxyReply({
                content: bot.locale('commands:masks.set.success'),
                components: [createActionRow([createSelectMenu({
                    customId: createCustomId(0, ctx.author.id, ctx.commandId, subCommand),
                    options: [
                        {
                            label: "nothing",
                            value: "nothing",
                        }
                    ],
                    placeholder: bot.locale('commands:masks.set.changed'),
                    disabled: true,
                })])]
            });
        } else {
            ctx.foxyReply({
                content: bot.locale('commands:masks.set.notOwned'),
                components: [createActionRow([createSelectMenu({
                    customId: createCustomId(0, ctx.author.id, ctx.commandId, subCommand),
                    options: [
                        {
                            label: "nothing",
                            value: "nothing",
                        }
                    ],
                    placeholder: bot.locale('commands:masks.set.changed'),
                    disabled: true,
                })])]
            })
        }
    }
}

export default executeMaskBuy;