import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { createEmbed } from "../../../../utils/discord/Embed";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";

const RpsButtonExecutor = async (context: ComponentInteractionContext) => {
    const [choice] = context.sentData;
    const acceptedReplies = ['rock', 'paper', 'scissors'];

    const random = Math.floor((Math.random() * acceptedReplies.length));
    const result = acceptedReplies[random];

    const embed = createEmbed({
        fields: [{
            name: await bot.rest.foxy.getUserDisplayName(context.author.id),
            value: bot.locale(`commands:rps.button.${choice}`),
            inline: true
        }, {
            name: "Foxy",
            value: bot.locale(`commands:rps.button.${result}`),
            inline: true
        }]
    });

    if (result === choice) {
        embed.description = bot.locale('commands:rps.tie');
        return context.sendReply({
            embeds: [embed],
        })
    }

    switch (choice) {
        case 'rock': {
            if (result === 'paper') {
                embed.description = bot.locale('commands:rps.clientWon', { result: bot.locale(`commands:rps.button.${result}`) });
                embed.fields = [{
                    name: await bot.rest.foxy.getUserDisplayName(context.author.id),
                    value: bot.locale(`commands:rps.button.${choice}`),
                    inline: true
                }, {
                    name: await bot.rest.foxy.getUserDisplayName(bot.id),
                    value: bot.locale(`commands:rps.button.${result}`),
                }]
                context.sendReply({
                    embeds: [embed],
                });
                return;
            }

            embed.description = bot.locale('commands:rps.won3');
            context.sendReply({
                embeds: [embed],
            });
            break;
        }

        case 'paper': {
            if (result === 'scissors') {
                embed.description = bot.locale('commands:rps.clientWon', { result: bot.locale(`commands:rps.button.${result}`) });
                return;
            }

            embed.description = bot.locale('commands:rps.won2');
            context.sendReply({
                embeds: [embed],
            });
            break;
        }

        case 'scissors': {
            if (result === 'rock') {
                embed.description = bot.locale('commands:rps.clientWon', { result: bot.locale(`commands:rps.button.${result}`) });
                context.sendReply({
                    embeds: [embed],
                });
                return;
            }

            embed.description = bot.locale('commands:rps.won');
            context.sendReply({
                embeds: [embed],
            });
            break;
        }

        case 'cancel': {
            embed.description = bot.locale('commands:rps.cancelled', { emoji: context.getEmojiById(bot.emotes.FOXY_CRY) });
            embed.fields = null;
            context.sendReply({
                embeds: [embed],
                components: [createActionRow([createButton({
                    label: bot.locale('commands:rps.button.rock'),
                    style: ButtonStyles.Primary,
                    customId: createCustomId(0, context.author.id, context.commandId, "rock"),
                    disabled: true,
                    emoji: {
                        id: BigInt(bot.emotes.ROCK)
                    }
                }), createButton({
                    label: bot.locale('commands:rps.button.paper'),
                    style: ButtonStyles.Primary,
                    customId: createCustomId(0, context.author.id, context.commandId, "paper"),
                    disabled: true,
                    emoji: {
                        name: "📄"
                    }
                }), createButton({
                    label: bot.locale('commands:rps.button.scissors'),
                    style: ButtonStyles.Primary,
                    customId: createCustomId(0, context.author.id, context.commandId, "scissors"),
                    disabled: true,
                    emoji: {
                        name: "✂"
                    }
                }), createButton({
                    label: bot.locale('commands:rps.button.cancel'),
                    style: ButtonStyles.Danger,
                    customId: createCustomId(0, context.author.id, context.commandId, "cancel"),
                    disabled: true,
                    emoji: {
                        id: BigInt(bot.emotes.FOXY_CRY)
                    }
                })])]
            });
        }
    }
}

export default RpsButtonExecutor;