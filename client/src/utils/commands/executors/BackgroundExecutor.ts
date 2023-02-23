import ComponentInteractionContext from "../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../index";
import { createActionRow, createSelectMenu, createButton, createCustomId } from "../../../utils/discord/Component";
import { MessageFlags } from "../../../utils/discord/Message";
import { ButtonStyles } from "discordeno/types";

const BackgroundExecutor = async (context: ComponentInteractionContext) => {
    const [code, background, subcommand] = context.sentData;
    const userData = await bot.database.getUser(context.author.id);
    if (subcommand === 'set' || code === 'set') {

        const userData = await bot.database.getUser(context.author.id);
        const code = context.interaction.data.values[0];
        if (!userData.backgrounds.includes(code)) return context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale("commands:background.set.notOwned")),
        });

        userData.background = code;
        await userData.save();
        return context.sendReply({
            components: [createActionRow([createSelectMenu({
                customId: createCustomId(0, context.author.id, context.commandId),
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
        await context.sendReply({
            flags: MessageFlags.Ephemeral,
            components: [createActionRow([createButton({
                customId: createCustomId(0, context.author.id, context.commandId, code, background, subcommand),
                label: bot.locale('commands:background.buy.purchase'),
                style: ButtonStyles.Secondary,
                emoji: {
                    id: bot.emotes.FOXY_DAILY
                },
                disabled: true
            })])]
        })
        
        if (userData.balance < background) {        
            context.followUp({
                content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:background.buy.noMoney')),
                flags: MessageFlags.Ephemeral
            })
        } else {
            userData.balance -= Number(background);
            userData.backgrounds.push(code);
            userData.background = code;
            await userData.save();
            context.followUp({
                content: bot.locale('commands:background.buy.success'),
                flags: MessageFlags.Ephemeral
            })
        }
    }
}

export default BackgroundExecutor;