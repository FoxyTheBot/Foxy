import { ButtonStyles, User } from "discordeno";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";
import { MessageFlags } from "../../../utils/discord/Message";
import { createEmbed } from "../../../utils/discord/Embed";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default async function SlapExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>("user", "users");
    const slapGif: any = await bot.rest.foxy.getImage("roleplay", "slap");
    const embed = createEmbed({});

    if (!user) {
        context.reply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser')),
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }
    
    if (user.id === bot.id) {
        context.reply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:slap.bot')),
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }

    if (user.id === context.author.id) {
        context.reply({
            content: context.makeReply(bot.emotes.FOXY_SCARED, t('commands:slap.self')),
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }
    embed.title = t('commands:slap.success', { target: await bot.rest.foxy.getUserDisplayName(user.id), author: await bot.rest.foxy.getUserDisplayName(context.author.id), user: await bot.rest.foxy.getUserDisplayName(user.id) }),
        embed.image = {
            url: slapGif.url
        }

    context.reply({
        embeds: [embed],
        components: [createActionRow([createButton({
            customId: createCustomId(
                0, 
                user.id, 
                context.commandId, 
                await bot.rest.foxy.getUserDisplayName(user.id),
                context.isMessage ? context.message.id : null,
                context.isMessage ? context.channelId : null
            ),
            label: t('commands:slap.button'),
            style: ButtonStyles.Primary,
            emoji: {
                id: BigInt(bot.emotes.FOXY_SCARED),
            }
        })])]
    })
    endCommand();
}