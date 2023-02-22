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

const executeKiss = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const kissGif = await gif.kiss();
    embed.title = bot.locale('commands:kiss.success', { user: context.author.username, author: user }),
        embed.image = {
            url: kissGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:kiss.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                name: '❤'
            },
            disabled: true
        })])]
    });
    context.followUp({
        embeds: [embed],
    });
}
const KissCommand = createCommand({
    name: 'kiss',
    nameLocalizations: {
        'pt-BR': 'beijar'
    },
    description: '[❤] - Beije alguém',
    descriptionLocalizations: {
        "en-US": "[❤] - Kiss someone"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Selecione o usuário que deseja beijar",
            descriptionLocalizations: {
                "en-US": "Select the user you want to kiss"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [executeKiss],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const kissGif = await gif.kiss();

        embed.title = t('commands:kiss.success', { user: user.username, author: context.author.username }),
            embed.image = {
                url: kissGif.url
            }

        context.sendReply({
            embeds: [embed],
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, context.commandId, user.username),
                label: t('commands:kiss.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    name: '❤'
                }
            })])]
        })
        context.followUp({
            embeds: [embed],
        });
        endCommand();
    }
});

export default KissCommand;