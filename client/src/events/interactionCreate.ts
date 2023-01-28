import i18next from 'i18next';
import { MessageFlags } from '../utils/discord/Message';
import { bot } from '../index';
import ChatInputInteractionContext from '../structures/commands/ChatInputInteractionContext';
import { createEmbed } from '../utils/discord/Embed';
module.exports = async (client, interaction) => {

    const user = await bot.database.getUser(interaction.user.id);
    const locale = global.t = i18next.getFixedT(user.language || 'pt-BR');
    const command = bot.commands.get(interaction.data?.name);
    const ctx = new ChatInputInteractionContext(
        interaction,
        user
    )
    function FoxyHandler() {
        new Promise(async (res, rej) => {
            try {
                command.execute(ctx, res, locale);
            } catch (e) {
                console.error(e);
                ctx.foxyReply({ content: locale('events:interactioncreate.commandError'), flags: MessageFlags.EPHEMERAL })
            }
        })
    }

    try {
        if (user.isBanned) {
            const embed = createEmbed({
                title: locale('events:ban.title'),
                description: locale('events:ban.description'),
                fields: [
                    { name: locale('events:ban.reason'), value: user.banReason },
                    { name: locale('events.ban.date'), value: user.banData.toLocaleString(global.t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }
                ]
            })
            ctx.foxyReply({ embeds: [embed], flags: 64 })
        }

        FoxyHandler();
    } catch (err) {
        console.error(err);
    }
}