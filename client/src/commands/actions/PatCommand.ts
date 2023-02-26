import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { ButtonStyles } from 'discordeno/types';
import { User } from 'discordeno/transformers';
import { createEmbed } from '../../utils/discord/Embed';
import { createActionRow, createButton, createCustomId } from '../../utils/discord/Component';
import { bot } from '../../index';
import PatExecutor from '../../utils/commands/executors/PatExecutor';
import gifs from 'nekos.life';
const gif = new gifs();
const embed = createEmbed({});

const patCommand = createCommand({
    name: 'pat',
    nameLocalizations: {
        'pt-BR': 'carinho'
    },
    description: '[Roleplay] Faça carinho em alguém',
    descriptionLocalizations: {
        "en-US": "[Roleplay] pat someone"
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
    commandRelatedExecutions: [PatExecutor],
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
                    id: bot.emotes.FOXY_WOW
                }
            })])]
        })
        endCommand();
    }
});

export default patCommand;