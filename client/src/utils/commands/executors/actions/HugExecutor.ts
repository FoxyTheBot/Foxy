import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createEmbed } from "../../../discord/Embed";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";
import gifs from 'nekos.life';
const gif = new gifs();

const HugExecutor = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const hugGif = await gif.hug();
    const embed = createEmbed({});

    embed.title = bot.locale('commands:hug.success', { user: context.author.username, author: user }),
        embed.image = {
            url: hugGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:hug.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                id: bot.emotes.FOXY_HUG
            },
            disabled: true
        })])]
    })
    context.followUp({
        embeds: [embed],
    });
}

export default HugExecutor;