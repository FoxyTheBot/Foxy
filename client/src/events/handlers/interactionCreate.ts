import i18next from 'i18next';
import { MessageFlags } from '../../utils/discord/Message';
import { bot } from '../../index';
import ChatInputInteractionContext from '../../structures/commands/ChatInputInteractionContext';
import { createEmbed } from '../../utils/discord/Embed';
import { InteractionTypes } from 'discordeno/types';
import { componentExecutor } from '../../structures/commands/ComponentExecutor';
import { logger } from '../../utils/logger';

const setInteractionCreateEvent = (): void => {
    bot.events.interactionCreate = async (_, interaction) => {
        const user = await bot.database.getUser(interaction.user.id);
        const locale = global.t = i18next.getFixedT(user.language || 'pt-BR');
        bot.locale = locale;
        const command = bot.commands.get(interaction.data?.name);
        const context = new ChatInputInteractionContext(interaction, user)
    
        if (interaction.type === InteractionTypes.MessageComponent || interaction.type === InteractionTypes.ModalSubmit) {
            componentExecutor(interaction);
            return;
        }
    
        async function FoxyHandler() {
            await new Promise(async (res) => {
                try {
                    command.execute(context, res, locale);
                    logger.info(`[COMMAND ${interaction.data?.name} - Success] by ${interaction.user.username} (${interaction.user.id})`)
                    bot.database.updateCommand(interaction.data?.name);
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
                        { name: locale('events:ban.date'), value: user.banData.toLocaleString(global.t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }
                    ]
                })
                return context.sendReply({
                    embeds: [embed],
                    flags: 64
                });
    
    
            }
    
            FoxyHandler();
        } catch (err) {
            console.error(err);
        }
    }
}

export { setInteractionCreateEvent }