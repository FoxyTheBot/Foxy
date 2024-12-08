import { ButtonStyles, MessageComponentTypes } from 'discordeno/types';
import { bot } from '../../../FoxyLauncher';
import { MessageFlags } from '../../../utils/discord/Message';
import { colors } from '../../../../../../common/utils/colors';
import { ExecutorParams } from '../../structures/CommandExecutor';

export default class DailyExecutor {

    async execute({ context, endCommand, t }: ExecutorParams) {
        context.reply({
            embeds: [{
                color: colors.FOXY_DEFAULT,
                title: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:daily.embed.title')),
                description: context.makeReply(bot.emotes.FOXY_YAY, t('commands:daily.embed.description')),
                thumbnail: {
                    url: bot.foxy.constants.DAILY_EMOJI
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
                    url: bot.foxy.constants.DAILY
                },
                {
                    type: MessageComponentTypes.Button,
                    style: ButtonStyles.Link,
                    label: t('commands:daily.embed.buyMore'),
                    emoji: {
                        id: BigInt(bot.emotes.FOXY_DAILY)
                    },
                    url: bot.foxy.constants.PREMIUM
                }]
            }],
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }
}