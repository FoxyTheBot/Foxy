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


const executeHug = async (ctx: ComponentInteractionContext) => {
    const [user] = ctx.sentData;
    const hugGif = await gif.hug();
    embed.title = bot.locale('commands:hug.success', {user: ctx.author.username, author: user}),
    embed.image = {
        url: hugGif.url
    }

    ctx.foxyReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, ctx.commandId),
            label: bot.locale('commands:hug.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                name: '❤'
            },
            disabled: true
        })])]
    })
    ctx.followUp({
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
    execute: async (ctx, endCommand, t) => {
        const user = ctx.getOption<User>("user", "users");
        const hugGif = await gif.hug();
     
        embed.title = t('commands:hug.success', {user: user.username, author: ctx.author.username}),
        embed.image = {
            url: hugGif.url
        }

        ctx.foxyReply({
            embeds: [embed],
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, ctx.commandId, user.username),
                label: t('commands:hug.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    name: '❤'
                }
            })])]
        })
        endCommand();
    }
});

export default HugCommand;