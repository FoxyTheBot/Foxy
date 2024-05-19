import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";
import { createEmbed } from "../../../../utils/discord/Embed";

const LickExecutor = async (context: ComponentInteractionContext) => {
    const [user, messageId] = context.sentData;
    const lickGif: any = await context.getImage("lick");
    const embed = createEmbed({});
    let commandAuthor = await bot.foxyRest.getUserDisplayName(context.author.id);
    
    if (messageId) {
        const message = bot.messages.get(BigInt(messageId));
        commandAuthor = await bot.foxyRest.getUserDisplayName(message.authorId);
    }

    embed.title = bot.locale('commands:lick.success', { user: commandAuthor, author: user }),
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