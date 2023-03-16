import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createActionRow, createSelectMenu, createCustomId } from "../../../discord/Component";

const BackgroundSetExecutor = async (context: ComponentInteractionContext) => {
    
    const userData = await bot.database.getUser(context.author.id);
    const code = context.interaction.data.values[0];
    if (!userData.backgrounds.includes(code)) return context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale("commands:background.set.notOwned")),
    });

    userData.background = code;
    await userData.save();
    return context.sendReply({
        components: [createActionRow([createSelectMenu({
            customId: createCustomId(1, context.author.id, context.commandId),
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
}

export default BackgroundSetExecutor;