import ComponentInteractionContext from "../../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../discord/Component";
import { createEmbed } from "../../../../discord/Embed";

const InviteBlockerEnableExecutor = async (context: ComponentInteractionContext) => {
    const guildInfo = await bot.database.getGuild(context.interaction.guildId);

        guildInfo.InviteBlockerModule.isEnabled = true;
        await guildInfo.save();

        const embed = createEmbed({
            title: bot.locale("commands:inviteBlocker.config.title"),
            description: bot.locale("commands:inviteBlocker.config.description"),
            fields: [{
                name: bot.locale("commands:inviteBlocker.config.fields.isEnabled"),
                value: guildInfo.InviteBlockerModule.isEnabled ?
                        `${context.getEmojiById(bot.emotes.FOXY_YAY)} ${bot.locale("commands:inviteBlocker.config.fields.isEnabledValue.enabled")}`
                        : `${context.getEmojiById(bot.emotes.FOXY_CRY)} ${bot.locale("commands:inviteBlocker.config.fields.isEnabledValue.disabled")}`
            },
            {
                name: bot.locale("commands:inviteBlocker.config.fields.blockMessage"),
                value: guildInfo.InviteBlockerModule.blockMessage ?? "Nenhuma mensagem definida"
            },
            {
                name: bot.locale("commands:inviteBlocker.config.fields.whitelistedChannels"),
                value: guildInfo.InviteBlockerModule.whitelistedChannels.length > 0 ? guildInfo.InviteBlockerModule.whitelistedChannels.map(channelId => `<#${channelId}>`).join(", ") : "Nenhum canal definido"
            },
            {
                name: bot.locale("commands:inviteBlocker.config.fields.whitelistedRoles"),
                value: guildInfo.InviteBlockerModule.whitelistedRoles.length > 0 ? guildInfo.InviteBlockerModule.whitelistedRoles.map(roleId => `<@&${roleId}>`).join(", ") : "Nenhum cargo definido"
            }]
        });


        const actionRow = createActionRow([createButton({
            label: bot.locale("commands:inviteBlocker.config.buttons.disable"),
            style: ButtonStyles.Danger,
            customId: createCustomId(1, context.author.id, context.commandId)
        }),
        createButton({
            label: bot.locale("commands:inviteBlocker.config.buttons.blockMessage"),
            style: ButtonStyles.Primary,
            customId: createCustomId(2, context.author.id, context.commandId)
        }),
        createButton({
            label: bot.locale("commands:inviteBlocker.config.buttons.reset"),
            style: ButtonStyles.Secondary,
            customId: createCustomId(3, context.author.id, context.commandId)
        })
        ]);

        await context.sendReply({
            embeds: [embed],
            components: [actionRow]
        });
    }

export default InviteBlockerEnableExecutor;