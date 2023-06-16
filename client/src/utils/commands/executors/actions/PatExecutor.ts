import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createEmbed } from "../../../discord/Embed";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";

const PatExecutor = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const patGif: any = await context.getImage("pat");
    const embed = createEmbed({});
    embed.title = bot.locale('commands:pat.success', { user: await bot.foxyRest.getUserDisplayName(context.author.id), author: user }),
        embed.image = {
            url: patGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:pat.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                id: bot.emotes.FOXY_WOW
            },
            disabled: true
        })])]
    });
    context.followUp({
        embeds: [embed],
    });
}

export default PatExecutor;