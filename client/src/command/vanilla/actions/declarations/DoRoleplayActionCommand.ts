import { ApplicationCommandTypes, ButtonStyles, MessageComponentTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import { bot } from "../../../../FoxyLauncher";
import { MessageFlags } from "../../../../utils/discord/Message";
import { createCustomId } from "../../../../utils/discord/Component";
import KissButtonExecutor from "../components/KissButtonExecutor";
import HugExecutor from "../components/HugButtonExecutor";
import PatExecutor from "../components/PatButtonExecutor";
import TickleExecutor from "../components/TickleButtonExecutor";
import LickExecutor from "../components/LickButtonExecutor";

const DoRoleplayActionCommand = createCommand({
    name: "Do a Roleplay action",
    nameLocalizations: {
        "pt-BR": "Fazer roleplay"
    },
    category: "actions",
    description: "Do a roleplay action",
    descriptionLocalizations: {
        "pt-BR": "Faça uma ação de roleplay"
    },
    type: ApplicationCommandTypes.User,
    commandRelatedExecutions: [KissButtonExecutor, HugExecutor, PatExecutor, TickleExecutor, LickExecutor],
    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        // EXPERIMENTAL
        
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_HUG, t('commands:roleplay.action')),
            flags: MessageFlags.EPHEMERAL,
            components: [{
                type: MessageComponentTypes.ActionRow,
                components: [{
                    type: MessageComponentTypes.Button,
                    style: ButtonStyles.Primary,
                    label: "Kiss",
                    customId: createCustomId(0, context.author.id, context.commandId)
                },
                {
                    type: MessageComponentTypes.Button,
                    style: ButtonStyles.Primary,
                    label: "Hug",
                    customId: createCustomId(1, context.author.id, context.commandId)
                },
                {
                    type: MessageComponentTypes.Button,
                    style: ButtonStyles.Primary,
                    label: "Pat",
                    customId: createCustomId(2, context.author.id, context.commandId)
                },
                {
                    type: MessageComponentTypes.Button,
                    style: ButtonStyles.Primary,
                    label: "Tickle",
                    customId: createCustomId(3, context.author.id, context.commandId)
                },
                {
                    type: MessageComponentTypes.Button,
                    style: ButtonStyles.Primary,
                    label: "Lick",
                    customId: createCustomId(4, context.author.id, context.commandId)
                }]
            }]
        });
    }
});

export default DoRoleplayActionCommand;