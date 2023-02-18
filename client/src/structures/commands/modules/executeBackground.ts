import ComponentInteractionContext from "../ComponentInteractionContext";
import { bot } from "../../../index";
import { createActionRow, createSelectMenu, createButton, createCustomId } from "../../../utils/discord/Component";
import { MessageFlags } from "../../../utils/discord/Message";
import { ButtonStyles } from "discordeno/types";

const executeBackground = async (ctx: ComponentInteractionContext) => {
    const [code, background, subcommand] = ctx.sentData;
    const userData = await bot.database.getUser(ctx.author.id);
    if (subcommand === 'set' || code === 'set') {

        const userData = await bot.database.getUser(ctx.author.id);
        const code = ctx.interaction.data.values[0];
        if (!userData.backgrounds.includes(code)) return ctx.foxyReply({
            content: ctx.makeReply(bot.emotes.cry, bot.locale("commands:background.set.notOwned")),
        });

        userData.background = code;
        await userData.save();
        return ctx.foxyReply({
            components: [createActionRow([createSelectMenu({
                customId: createCustomId(0, ctx.author.id, ctx.commandId),
                placeholder: bot.locale('commands:background.set.success'),
                options: [
                    {
                        label: "Default",
                        value: "default"
                    }
                ],
                disabled: true
            })])]
        });
    } else if (subcommand === "buy") {
        await ctx.foxyReply({
            flags: MessageFlags.Ephemeral,
            components: [createActionRow([createButton({
                customId: createCustomId(0, ctx.author.id, ctx.commandId, code, background, subcommand),
                label: bot.locale('commands:background.buy.purchase'),
                style: ButtonStyles.Secondary,
                emoji: bot.emotes.daily,
                disabled: true
            })])]
        })
        
        if (userData.balance < background) {        
            ctx.followUp({
                content: ctx.makeReply(bot.emotes.cry, bot.locale('commands:background.buy.noMoney')),
                flags: MessageFlags.Ephemeral
            })
        } else {
            userData.balance -= Number(background);
            userData.backgrounds.push(code);
            userData.background = code;
            await userData.save();
            ctx.followUp({
                content: bot.locale('commands:background.buy.success'),
                flags: MessageFlags.Ephemeral
            })
        }
    }
}

export default executeBackground;