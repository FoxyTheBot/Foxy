import ComponentInteractionContext from "../ComponentInteractionContext";
import { bot } from "../../../index";
import { createActionRow, createSelectMenu, createCustomId } from "../../../utils/discord/Component";

const executeBackgroundSet = async (ctx: ComponentInteractionContext) => {
    if (ctx.subCommand === "set") {
        const userData = await bot.database.getUser(ctx.author.id);
        const code = ctx.interaction.data.values[0];

        userData.background = code;
        await userData.save();
        return ctx.foxyReply({
            components: [createActionRow([createSelectMenu({
                customId: createCustomId(0, ctx.author.id, "background"),
                placeholder: bot.locale('commands:background.set.select'),
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
}

export default executeBackgroundSet;