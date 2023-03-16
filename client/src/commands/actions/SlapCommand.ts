import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { ButtonStyles } from 'discordeno/types';
import { User } from 'discordeno/transformers';
import { createEmbed } from '../../utils/discord/Embed';
import { createActionRow, createButton, createCustomId } from '../../utils/discord/Component';
import { bot } from '../../index';
import SlapExecutor from '../../utils/commands/executors/actions/SlapExecutor';
import gifs from 'nekos.life';
const gif = new gifs();
const embed = createEmbed({});


const SlapCommand = createCommand({
    name: 'slap',
    nameLocalizations: {
        'pt-BR': 'tapa'
    },
    description: '[Roleplay] Slaps someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Dê um tapa em alguém"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to slap",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja bater"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [SlapExecutor],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const slapGif = await gif.slap();

        embed.title = t('commands:slap.success', { user: user.username, author: context.author.username }),
            embed.image = {
                url: slapGif.url
            }

        context.sendReply({
            embeds: [embed],
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, context.commandId, user.username),
                label: t('commands:slap.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    id: bot.emotes.FOXY_SCARED,
                }
            })])]
        })
        endCommand();
    }
});

export default SlapCommand;