import { FoxyClient } from "../../../structures/types/FoxyClient";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function ValorantHelpExecutor(bot: FoxyClient, context: UnleashedCommandExecutor, endCommand, t) {
    context.sendReply({
        embeds: [createEmbed({
            color: bot.colors.VALORANT,
            title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.help.embed.title')),
            description: t('commands:valorant.help.embed.description'),
            fields: [{
                name: `\`${t('commands:valorant.help.embed.fields.verify.title')}\``,
                value: t('commands:valorant.help.embed.fields.verify.description'),
                inline: true
            },
            {
                name: `\`${t('commands:valorant.help.embed.fields.link.title')}\``,
                value: t('commands:valorant.help.embed.fields.link.description'),
                inline: true
            },
            {
                name: `\`${t('commands:valorant.help.embed.fields.set-visibility.title')}\``,
                value: t('commands:valorant.help.embed.fields.set-visibility.description'),
                inline: true
            },
            {
                name: `\`${t('commands:valorant.help.embed.fields.stats.title')}\``,
                value: t('commands:valorant.help.embed.fields.stats.description'),
                inline: true
            },
            {
                name: `\`${t('commands:valorant.help.embed.fields.matches.title')}\``,
                value: t('commands:valorant.help.embed.fields.matches.description'),
                inline: true
            },
            {
                name: `\`${t('commands:valorant.help.embed.fields.autorole.title')}\``,
                value: t('commands:valorant.help.embed.fields.autorole.description'),
                inline: true
            }],

            footer: {
                text: t('commands:valorant.help.embed.footer')
            }
        })]
    });
    return endCommand();
}