import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";
import { createEmbed } from "../../../discord/Embed";

const LickExecutor = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const lickGif: any = await context.getImage("lick");
    const embed = createEmbed({});
    embed.title = bot.locale('commands:lick.success', { user: await bot.foxyRest.getUserDisplayName(context.author.id), author: user }),
        embed.image = {
            url: lickGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:lick.button'),
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

export default LickExecutor;