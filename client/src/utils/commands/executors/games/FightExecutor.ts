import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createEmbed } from "../../../discord/Embed";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";
import updateFightScore from "../../tools/FightScore";

const FightExecutor = async (context: ComponentInteractionContext) => {
    const [targetId, targetUsername, firstExecution] = context.sentData;

    const stats = updateFightScore({
        id: context.author.id,
        username: context.author.username,
        health: 100,
        isYourTurn: true
    }, {
        id: BigInt(targetId),
        username: targetUsername,
        health: 100,
        isYourTurn: false
    });

    const embed = createEmbed({
        description: bot.locale('commands:fight.yourTurn', { target: context.author.username }),
        fields: [{
            name: context.author.username,
            value: `${stats.userStats.health} HP`,
            inline: true,
        },
        {
            name: targetUsername,
            value: `${stats.targetStats.health} HP`,
            inline: true,
        }]
    });

    context.sendReply({
        embeds: [embed],
        components: [createActionRow([createButton({
            label: bot.locale('commands:fight.attack'),
            style: ButtonStyles.Primary,
            customId: createCustomId(2, context.author.id, context.commandId, targetId, targetUsername, "attack"),
        }),
        createButton({
            label: bot.locale('commands:fight.defend'),
            style: ButtonStyles.Primary,
            customId: createCustomId(2, context.author.id, context.commandId, targetId, targetUsername, "act"),
        }),
        createButton({
            label: bot.locale('commands:fight.mercy'),
            style: ButtonStyles.Danger,
            customId: createCustomId(2, context.author.id, context.commandId, targetId, targetUsername, "mercy"),
        })])]
    });
}

export default FightExecutor;