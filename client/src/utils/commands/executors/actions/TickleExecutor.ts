import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";
import { createEmbed } from "../../../discord/Embed";

const TickleExecutor = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const tickleGif: any = await context.getImage("tickle");
    const embed = createEmbed({});
    embed.title = bot.locale('commands:tickle.success', { user: await bot.foxyRest.getUserDisplayName(context.author.id), author: user }),
        embed.image = {
            url: tickleGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:tickle.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                id: bot.emotes.FOXY_CUPCAKE
            },
            disabled: true
        })])]
    });
    context.followUp({
        embeds: [embed],
    });
}

export default TickleExecutor;