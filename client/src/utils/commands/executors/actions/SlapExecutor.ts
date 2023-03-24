import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createEmbed } from "../../../discord/Embed";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";

const SlapExecutor = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const slapGif: any = await context.getImage("slap");
    const embed = createEmbed({});

    embed.title = bot.locale('commands:slap.success', { user: context.author.username, author: user }),
        embed.image = {
            url: slapGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:slap.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                id: bot.emotes.FOXY_SCARED,
            },
            disabled: true
        })])]
    });
    context.followUp({
        embeds: [embed],
    });
}

export default SlapExecutor;