import { ButtonStyles, MessageComponentTypes } from 'discordeno/types';
import { bot } from '../../../FoxyLauncher';
import { MessageFlags } from '../../../utils/discord/Message';
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { colors } from '../../../utils/colors';

export default class DailyExecutor {

    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        context.sendReply({
            embeds: [{
                color: colors.FOXY_DEFAULT,
                title: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:daily.embed.title')),
                description: context.makeReply(bot.emotes.FOXY_YAY, t('commands:daily.embed.description')),
                thumbnail: {
                    url: "https://cdn.discordapp.com/emojis/915736630495686696.png?size=2048"
                }
            }],
            components: [{
                type: MessageComponentTypes.ActionRow,
                components: [{
                    type: MessageComponentTypes.Button,
                    style: ButtonStyles.Link,
                    label: t('commands:daily.embed.button'),
                    emoji: {
                        id: BigInt(bot.emotes.FOXY_PETPET)
                    },
                    url: "https://foxybot.win/br/daily"
                }]
            }],
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }
}