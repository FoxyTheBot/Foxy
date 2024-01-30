import { ButtonStyles } from "discordeno/types";
import { bot } from "../../../../..";
import ComponentInteractionContext from "../../../../../structures/commands/ComponentInteractionContext";
import { createActionRow, createButton, createCustomId } from "../../../../discord/Component";
import { createEmbed } from "../../../../discord/Embed";
import { MessageFlags } from "../../../../discord/Message";

const RoleSelectedExecutor = async (context: ComponentInteractionContext) => {
    const roles = context.interaction.data.resolved.roles;
    const guildInfo = await bot.database.getGuild(context.interaction.guildId);

    let notAddedRoles = [];
    let addedRoles = [];

    roles.map((role) => {
        if (!role.toggles.managed) {
            addedRoles.push({ name: role.name, id: role.id });
        } else {
            notAddedRoles.push({ name: role.name, id: role.id });
        }
    });

    if (guildInfo.InviteBlockerModule.whitelistedRoles.length === 5) {
        guildInfo.InviteBlockerModule.whitelistedRoles = addedRoles.slice(0, 5).map(role => role.id);
    } else {
        const remainingSpace = 5 - guildInfo.InviteBlockerModule.whitelistedRoles.length;
        const newRolesToAdd = addedRoles.slice(0, remainingSpace).map(role => role.id);
        guildInfo.InviteBlockerModule.whitelistedRoles = [...guildInfo.InviteBlockerModule.whitelistedRoles, ...newRolesToAdd];
    }

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
            value: guildInfo.InviteBlockerModule.blockMessage ?? bot.locale('commands:inviteBlocker.config.fields.noBlockMessage'),
        },
        {
            name: bot.locale("commands:inviteBlocker.config.fields.whitelistedChannels"),
            value: guildInfo.InviteBlockerModule.whitelistedChannels.length > 0 ? guildInfo.InviteBlockerModule.whitelistedChannels.map(channelId => `<#${channelId}>`).join(", ") : bot.locale("commands:inviteBlocker.config.fields.noWhitelistedChannels")
        },
        {
            name: bot.locale("commands:inviteBlocker.config.fields.whitelistedRoles"),
            value: guildInfo.InviteBlockerModule.whitelistedRoles.length > 0 ? guildInfo.InviteBlockerModule.whitelistedRoles.map(roleId => `<@&${roleId}>`).join(", ") : bot.locale("commands:inviteBlocker.config.fields.noWhitelistedRoles")
        },
        {
            name: bot.locale("commands:inviteBlocker.config.fields.whitelistedUsers"),
            value: guildInfo.InviteBlockerModule.whitelistedUsers.length > 0 ? guildInfo.InviteBlockerModule.whitelistedUsers.map(userId => `<@${userId}>`).join(", ") : bot.locale("commands:inviteBlocker.config.fields.noWhitelistedUsers")
        }]
    });

    if (notAddedRoles.length !== 0) {
        embed.footer = {
            text: `Os cargos ${notAddedRoles.map(role => `\`${role.name}\``).join(", ")} não foram adicionados à lista de cargos permitidos pois são cargos de bots (integrações).`
        }
    }

    context.sendReply({
        embeds: [embed],
        components: [createActionRow([createButton({
            label: guildInfo.InviteBlockerModule.isEnabled ? bot.locale("commands:inviteBlocker.config.buttons.disable") : bot.locale("commands:inviteBlocker.config.buttons.enable"),
            style: guildInfo.InviteBlockerModule.isEnabled ? ButtonStyles.Danger : ButtonStyles.Success,
            customId: createCustomId(0, context.author.id, context.commandId),
        }),
        createButton({
            label: bot.locale("commands:inviteBlocker.config.buttons.blockMessage"),
            style: ButtonStyles.Secondary,
            disabled: guildInfo.InviteBlockerModule.isEnabled ? false : true,
            customId: createCustomId(2, context.author.id, context.commandId)
        }),
        createButton({
            customId: createCustomId(5, context.author.id, context.commandId),
            label: bot.locale("commands:inviteBlocker.config.buttons.addRole"),
            style: ButtonStyles.Primary,
            disabled: guildInfo.InviteBlockerModule.isEnabled ? false : true
        }),
        createButton({
            label: bot.locale("commands:inviteBlocker.config.buttons.addChannel"),
            style: ButtonStyles.Primary,
            customId: createCustomId(7, context.author.id, context.commandId),
            disabled: guildInfo.InviteBlockerModule.isEnabled ? false : true
        }),
        createButton({
            label: bot.locale("commands:inviteBlocker.config.buttons.reset"),
            style: ButtonStyles.Secondary,
            disabled: guildInfo.InviteBlockerModule.isEnabled ? false : true,
            customId: createCustomId(3, context.author.id, context.commandId)
        })])]
    });
}

export default RoleSelectedExecutor;