import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function ValorantUnlinkExecutor(bot, context: UnleashedCommandExecutor, endCommand, t) {
    const userData = await bot.database.getUser(context.author.id);

    if (!userData.riotAccount.isLinked) {
        return context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:valorant.unlink.notLinked')),
            flags: 64
        });
    }

    return context.sendReply({
        embeds: [{
            title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.unlink.embed.title')),
            description: t('commands:valorant.unlink.embed.description')
        }],
        components: [createActionRow([createButton({
            label: t('commands:valorant.unlink.button.label'),
            style: ButtonStyles.Danger,
            emoji: {
                id: bot.emotes.FOXY_CRY
            },
            customId: createCustomId(4, context.author.id, context.commandId)
        })])]
    });
}