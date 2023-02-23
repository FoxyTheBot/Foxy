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


const executeHug = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const hugGif = await gif.hug();
    embed.title = bot.locale('commands:hug.success', {user: context.author.username, author: user}),
    embed.image = {
        url: hugGif.url
    }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:hug.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                name: bot.emotes.FOXY_HUG
            },
            disabled: true
        })])]
    })
    context.followUp({
        embeds: [embed],
    });
}

const HugCommand = createCommand({
    name: 'hug',
    nameLocalizations: {
        'pt-BR': 'abraçar'
    },
    description: '[❤] - Abraçe alguém',
    descriptionLocalizations: {
        "en-US": "[❤] - Hug someone"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Selecione o usuário que deseja abraçar",
            descriptionLocalizations: {
                "en-US": "Select the user you want to hug"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [executeHug],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const hugGif = await gif.hug();
     
        embed.title = t('commands:hug.success', {user: user.username, author: context.author.username}),
        embed.image = {
            url: hugGif.url
        }

        context.sendReply({
            embeds: [embed],
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, context.commandId, user.username),
                label: t('commands:hug.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    name: bot.emotes.FOXY_HUG
                }
            })])]
        })
        endCommand();
    }
});

export default HugCommand;