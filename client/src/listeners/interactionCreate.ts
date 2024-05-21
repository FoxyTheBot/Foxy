import i18next from 'i18next';
import { MessageFlags } from '../utils/discord/Message';
import { bot } from '../FoxyLauncher';
import { createEmbed } from '../utils/discord/Embed';
import { ButtonStyles, InteractionTypes } from 'discordeno/types';
import { componentExecutor } from '../command/structures/ComponentExecutor';
import { logger } from '../utils/logger';
import { createActionRow, createButton } from '../utils/discord/Component';
import UnleashedCommandExecutor from '../command/structures/UnleashedCommandExecutor';

const setInteractionCreateEvent = (): void => {
    bot.events.interactionCreate = async (_, interaction) => {
        const user = await bot.database.getUser(interaction.user.id);
        const locale = global.t = i18next.getFixedT(user.userSettings.language || 'pt-BR');
        bot.locale = locale;
        const command = bot.commands.get(interaction.data?.name);
        const context = new UnleashedCommandExecutor(locale, null, interaction);

        if (interaction.type === InteractionTypes.MessageComponent || interaction.type === InteractionTypes.ModalSubmit) {
            componentExecutor(interaction);
            return;
        }

        async function FoxyHandler() {
            await new Promise(async (res) => {
                try {
                    command.execute(context, res, locale);
                    if (bot.isProduction) {
                        logger.commandLog(interaction.data?.name, interaction.user, interaction.guildId ? interaction.guildId.toString() : "DM", interaction.data?.options?.map((option) => option.value).join(' ') || 'Nenhum');
                        bot.database.updateCommand(interaction.data?.name);
                    }
                } catch (e) {
                    console.error(e);
                    context.sendReply({ content: locale('events:interactionCreate.commandError'), flags: MessageFlags.EPHEMERAL })
                }
            });
        }

        try {
            if (user.isBanned) {
                const embed = createEmbed({
                    title: locale('events:ban.title'),
                    description: locale('events:ban.description'),
                    fields: [
                        { name: locale('events:ban.reason'), value: user.banReason },
                        { name: locale('events:ban.date'), value: user.banDate.toLocaleString(global.t.lng || 'pt-BR', { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }
                    ]
                })
                return context.sendReply({
                    embeds: [embed],
                    components: [createActionRow([createButton({
                        label: locale('events:ban.button'),
                        style: ButtonStyles.Link,
                        emoji: {
                            id: BigInt(bot.emotes.FOXY_CUPCAKE)
                        },
                        url: 'https://forms.gle/bKfRKxoyFGZzRB7x8'
                    })])],
                    flags: MessageFlags.EPHEMERAL
                });
            }

            FoxyHandler();
        } catch (err) {
            console.error(err);
        }
    }
}

export { setInteractionCreateEvent }