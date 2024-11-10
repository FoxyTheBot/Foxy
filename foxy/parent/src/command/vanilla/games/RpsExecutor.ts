import { ButtonStyles } from "discordeno/types";
import { bot } from '../../../FoxyLauncher';
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class RpsExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const embed = createEmbed({
            description: t('commands:rps.start'),
            fields: [{
                name: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id),
                value: t('commands:rps.defaultValue'),
                inline: true
            },
            {
                name: "Foxy",
                value: t('commands:rps.defaultValue'),
                inline: true
            }]
        });

        context.reply({
            embeds: [embed],
            components: [createActionRow([createButton({
                label: bot.locale('commands:rps.button.rock'),
                style: ButtonStyles.Primary,
                customId: createCustomId(0, (await context.getAuthor()).id, context.commandId, "rock"),
                emoji: {
                    id: BigInt(bot.emotes.ROCK)
                }
            }), createButton({
                label: bot.locale('commands:rps.button.paper'),
                style: ButtonStyles.Primary,
                customId: createCustomId(0, (await context.getAuthor()).id, context.commandId, "paper"),
                emoji: {
                    name: "📄"
                }
            }), createButton({
                label: bot.locale('commands:rps.button.scissors'),
                style: ButtonStyles.Primary,
                customId: createCustomId(0, (await context.getAuthor()).id, context.commandId, "scissors"),
                emoji: {
                    name: "✂"
                }
            }), createButton({
                label: bot.locale('commands:rps.button.cancel'),
                style: ButtonStyles.Danger,
                customId: createCustomId(0, (await context.getAuthor()).id, context.commandId, "cancel"),
                emoji: {
                    id: BigInt(bot.emotes.FOXY_CRY)
                }
            })])]
        });

        return endCommand();
    }
}