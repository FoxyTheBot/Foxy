import i18next from 'i18next';
import { MessageFlags } from '../utils/discord/Message';
import { bot } from '../FoxyLauncher';
import { createEmbed } from '../utils/discord/Embed';
import { ButtonStyles, InteractionTypes } from 'discordeno/types';
import { componentExecutor } from '../command/structures/ComponentExecutor';
import { logger } from '../../../../common/utils/logger';
import { createActionRow, createButton } from '../utils/discord/Component';
import UnleashedCommandExecutor from '../command/structures/UnleashedCommandExecutor';
import { commandLogger } from '../utils/commandLogger';

const setInteractionCreateEvent = (): void => {
    bot.events.interactionCreate = async (_, interaction) => {
        const user = await bot.database.getUser(interaction.user.id);
        const locale: any = global.t = i18next.getFixedT(user.userSettings.language || 'pt-BR');
        bot.locale = locale;

        const context = new UnleashedCommandExecutor(locale, null, interaction);
        if (interaction.type === InteractionTypes.MessageComponent || interaction.type === InteractionTypes.ModalSubmit) {
            componentExecutor(interaction);
            return;
        }

        const handleBan = async () => {
            const embed = createEmbed({
                title: locale('events:ban.title'),
                description: locale('events:ban.description'),
                fields: [
                    { name: locale('events:ban.reason'), value: user.banReason },
                    { name: locale('events:ban.date'), value: user.banDate.toLocaleString(locale.lng || 'pt-BR', { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }
                ]
            });
            await context.reply({
                embeds: [embed],
                components: [createActionRow([createButton({
                    label: locale('events:ban.button'),
                    style: ButtonStyles.Link,
                    emoji: { id: BigInt(bot.emotes.FOXY_CUPCAKE) },
                    url: 'https://forms.gle/bKfRKxoyFGZzRB7x8'
                })])],
                flags: MessageFlags.EPHEMERAL
            });
        };

        const executeCommand = async () => {
            const command = bot.commands.get(interaction.data?.name);
            if (!command) return;

            try {
                await command.execute(context, () => {}, locale);
                if (bot.isProduction) {
                    commandLogger.commandLog(interaction.data?.name,
                        interaction.user,
                        interaction.guildId ? interaction.guildId.toString() : "DM",
                        interaction.data?.options?.map(option => option.value).join(' ') || 'Nenhum'
                    );
                    bot.database.updateCommand(interaction.data?.name);
                }
            } catch (e) {
                logger.error(e);
                await context.reply({ content: locale('events:interactionCreate.commandError'), flags: MessageFlags.EPHEMERAL });
            }
        };

        try {
            if (user.isBanned) {
                await handleBan();
            } else {
                await executeCommand();
            }
        } catch (err) {
            logger.error(err);
        }
    };
};

export { setInteractionCreateEvent };