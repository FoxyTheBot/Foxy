import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createActionRow, createCustomId, createButton, createSelectMenu } from "../../../../utils/discord/Component";

const MaskSetExecutor = async (context: ComponentInteractionContext) => {
    const choice = context.interaction.data.values[0];
    const userData = await bot.database.getUser(context.author.id);

    if (userData.masks.includes(choice)) {
        userData.mask = choice;
        userData.save();
        context.sendReply({
            content: bot.locale('commands:masks.set.success'),
            components: [createActionRow([createSelectMenu({
                customId: createCustomId(1, context.author.id, context.commandId),
                options: [
                    {
                        label: "nothing",
                        value: "nothing",
                    }
                ],
                placeholder: bot.locale(`commands:masks.list.${choice}`),
                disabled: true,
            })])]
        });
    } else {
        context.sendReply({
            content: bot.locale('commands:masks.set.notOwned'),
            components: [createActionRow([createSelectMenu({
                customId: createCustomId(1, context.author.id, context.commandId),
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

export default MaskSetExecutor;