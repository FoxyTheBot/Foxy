import { bot } from "../../../FoxyLauncher";
import { colors } from "../../../../../../common/utils/colors";
import { createEmbed } from "../../../utils/discord/Embed";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class HelpExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const embed = createEmbed({
            title: bot.helpers.foxy.getEmojiById(bot.emotes.FOXY_HOWDY) + " " + "Foxy",
            color: colors.FOXY_DEFAULT,
            description: t('commands:help.bot.description', { user: (await context.getAuthor()).asMention }),
            fields: [
                {
                    name: bot.helpers.foxy.getEmojiById(bot.emotes.FOXY_WOW) + " " + t('commands:help.bot.fields.addme'),
                    value: `[${t('help.bot.fields.add')}](${bot.foxy.constants.INVITE_LINK})`,
                },
                {
                    name: bot.helpers.foxy.getEmojiById(bot.emotes.FOXY_CUPCAKE) + " " + t('commands:help.bot.fields.support'),
                    value: bot.foxy.constants.SUPPORT_SERVER,
                },
                {
                    name: bot.helpers.foxy.getEmojiById(bot.emotes.FOXY_PRAY) + " " + t('commands:help.bot.fields.crowdin'),
                    value: bot.foxy.constants.CROWDIN,
                },
                {
                    name: bot.helpers.foxy.getEmojiById(bot.emotes.FOXY_SUNGLASSES) + " " + t('commands:help.bot.fields.website'),
                    value: bot.foxy.constants.FOXY_WEBSITE,
                },
                {
                    name: bot.helpers.foxy.getEmojiById(bot.emotes.FOXY_WOW) + " " + t('commands:help.bot.fields.privacy'),
                    value: bot.foxy.constants.TERMS,
                }
            ],
            thumbnail: {
                url: bot.foxy.constants.FOXY_AVATAR
            }
        });
        context.reply({ embeds: [embed] });
        return endCommand();
    }
}
