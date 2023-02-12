import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { ButtonStyles } from 'discordeno/types';
import { User } from 'discordeno/transformers';
import { createEmbed } from '../../utils/discord/Embed';
import { createActionRow, createButton, createCustomId } from '../../utils/discord/Component';
import { bot } from '../../index';
import ComponentInteractionContext from '../../structures/commands/ComponentInteractionContext'
import gifs from 'nekos.life';
const gif = new gifs();
const embed = createEmbed({});

const executeSlap = async (ctx: ComponentInteractionContext) => {
    const [user] = ctx.sentData;
    const slapGif = await gif.slap();
    embed.title = bot.locale('commands:slap.success', { user: ctx.author.username, author: user  }),
        embed.image = {
            url: slapGif.url
        }

    ctx.foxyReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, ctx.commandId),
            label: bot.locale('commands:slap.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                name: '👋'
            },
            disabled: true
        })])]
    });
    ctx.followUp({
        embeds: [embed],
    });
}
const SlapCommand = createCommand({
    name: 'slap',
    nameLocalizations: {
        'pt-BR': 'tapa'
    },
    description: '[❤] - Dê um tapespa em alguém',
    descriptionLocalizations: {
        "en-US": "[❤] - Slaps someone"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Selecione o usuário que deseja bater",
            descriptionLocalizations: {
                "en-US": "Select the user you want to slap"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [executeSlap],
    execute: async (ctx, endCommand, t) => {
        const user = ctx.getOption<User>("user", "users");
        const slapGif = await gif.slap();

        embed.title = t('commands:slap.success', { user: user.username, author: ctx.author.username }),
            embed.image = {
                url: slapGif.url
            }

        ctx.foxyReply({
            embeds: [embed],
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, ctx.commandId, user.username),
                label: t('commands:slap.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    name: '👋'
                }
            })])]
        })
        endCommand();
    }
});

export default SlapCommand;