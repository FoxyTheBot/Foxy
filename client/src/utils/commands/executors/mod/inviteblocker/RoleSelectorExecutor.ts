import { MessageComponentTypes } from "discordeno/types";
import { bot } from "../../../../..";
import ComponentInteractionContext from "../../../../../structures/commands/ComponentInteractionContext";
import { createCustomId } from "../../../../discord/Component";

const RoleSelectorExecutor = async (context: ComponentInteractionContext) => {
    const guildInfo = await bot.database.getGuild(context.interaction.guildId);
    context.sendReply({
        embeds: [{
            title: 'Selecione os cargos que deseja adicionar à lista de cargos permitidos:',
            description: 'Cargos de bots (integrações) não podem ser adicionados à lista de cargos permitidos.',
        }],
        components: [{
            type: MessageComponentTypes.ActionRow,
            components: [{
                type: MessageComponentTypes.SelectMenuRoles,
                customId: createCustomId(6, context.author.id, context.commandId),
                placeholder: bot.locale("commands:inviteBlocker.config.selectors.roleSelector.placeholder"),
                minValues: 1,
                maxValues: Math.max(0, 5 - guildInfo.InviteBlockerModule.whitelistedRoles.length),
                disabled: guildInfo.InviteBlockerModule.whitelistedRoles.length >= 5,
            }]
        }]
    });
}

export default RoleSelectorExecutor;