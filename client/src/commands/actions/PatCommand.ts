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

const executePat = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const patGif = await gif.pat();
    embed.title = bot.locale('commands:pat.success', { user: context.author.username, author: user }),
        embed.image = {
            url: patGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:pat.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                name: bot.emotes.FOXY_WOW
            },
            disabled: true
        })])]
    });
    context.followUp({
        embeds: [embed],
    });
}

const patCommand = createCommand({
    name: 'pat',
    nameLocalizations: {
        'pt-BR': 'carinho'
    },
    description: '[❤] - Faça carinho em alguém',
    descriptionLocalizations: {
        "en-US": "[❤] - pat someone"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Selecione o usuário que deseja fazer carinho",
            descriptionLocalizations: {
                "en-US": "Select the user you want to pat"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [executePat],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const patGif = await gif.pat();

        embed.title = t('commands:pat.success', { user: user.username, author: context.author.username }),
            embed.image = {
                url: patGif.url
            }

        context.sendReply({
            embeds: [embed],
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, context.commandId, user.username),
                label: t('commands:pat.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    name: bot.emotes.FOXY_WOW
                }
            })])]
        })
        endCommand();
    }
});

export default patCommand;