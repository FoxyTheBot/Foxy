import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";

const ConfirmDeletionExecutor = async (context: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(context.author.id);

    userData.riotAccount = {
        isLinked: false,
        puuid: null,
        isPrivate: null,
        region: null
    }

    await userData.save();

    return context.sendReply({
        embeds: [{
            title: context.makeReply(bot.emotes.VALORANT_LOGO, bot.locale('commands:valorant.unlink.embed.title')),
            description: bot.locale('commands:valorant.unlink.embed.description')
        }],
        components: [createActionRow([createButton({
            label: bot.locale('commands:valorant.unlink.button.labelConfirmed'),
            style: ButtonStyles.Danger,
            emoji: {
                id: bot.emotes.FOXY_CRY
            },
            customId: createCustomId(4, context.author.id, context.commandId),
            disabled: true,
        })])]
    });
}

export default ConfirmDeletionExecutor;