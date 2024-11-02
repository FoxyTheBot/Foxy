import { bot } from "../../../FoxyLauncher";
import { colors } from "../../../../../../common/utils/colors";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class HelpExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const embed = createEmbed({
            title: context.getEmojiById(bot.emotes.FOXY_HOWDY) + " " + "Foxy",
            color: colors.FOXY_DEFAULT,
            description: t('commands:help.bot.description', { user: `<@!${context.author.id}>` }),
            fields: [
                {
                    name: context.getEmojiById(bot.emotes.FOXY_WOW) + " " + t('commands:help.bot.fields.addme'),
                    value: `[${t('help.bot.fields.add')}](https://discord.com/oauth2/authorize?client_id=1006520438865801296&scope=bot+applications.commands&permissions=269872255)`,
                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_CUPCAKE) + " " + t('commands:help.bot.fields.support'),
                    value: `https://foxybot.win/br/support`,
                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_PRAY) + " " + t('commands:help.bot.fields.crowdin'),
                    value: "https://foxybot.win/translate",
                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_SUNGLASSES) + " " + t('commands:help.bot.fields.website'),
                    value: "https://foxybot.win",
                },
                {
                    name: context.getEmojiById(bot.emotes.FOXY_WOW) + " " + t('commands:help.bot.fields.privacy'),
                    value: "https://foxybot.win/br/support/terms",
                }
            ],
            thumbnail: {
                url: "https://cdn.discordapp.com/attachments/1078322762550083736/1233237607010406482/Foxy.png?ex=662c5d85&is=662b0c05&hm=70d01fc36628386c9809fc1db26f10be9d9a4efedba2aa5ccfbba05cc0704888&"
            }
        });
        context.reply({ embeds: [embed] });
        endCommand();
    }
}
