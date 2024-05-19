import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { createEmbed } from "../../../../utils/discord/Embed";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";

const HugExecutor = async (context: ComponentInteractionContext) => {
    const [user, messageId] = context.sentData;
    const hugGif: any = await context.getImage("hug");
    const embed = createEmbed({});
    let commandAuthor = await bot.foxyRest.getUserDisplayName(context.author.id);
    
    if (messageId) {
        const message = bot.messages.get(BigInt(messageId));
        commandAuthor = await bot.foxyRest.getUserDisplayName(message.authorId);
    }

    embed.title = bot.locale('commands:hug.success', { user: commandAuthor, author: user }),
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
    });
    context.followUp({
        embeds: [embed],
    });
}

export default HugExecutor;