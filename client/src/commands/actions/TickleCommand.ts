import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { ButtonStyles } from 'discordeno/types';
import { User } from 'discordeno/transformers';
import { createEmbed } from '../../utils/discord/Embed';
import { createActionRow, createButton, createCustomId } from '../../utils/discord/Component';
import { bot } from '../../index';
import TickleExecutor from "../../utils/commands/executors/actions/TickleExecutor";

const embed = createEmbed({});

const tickleCommand = createCommand({
    name: 'tickle',
    nameLocalizations: {
        'pt-BR': 'cócegas'
    },
    description: '[Roleplay] tickle someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Faça cócegas em alguém"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to tickle",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja fazer cócegas"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [TickleExecutor],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const tickleGif: any = await context.getImage("tickle");

        embed.title = t('commands:tickle.success', { user: user.username, author: context.author.username }),
            embed.image = {
                url: tickleGif.url
            }

        context.sendReply({
            embeds: [embed],
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, context.commandId, user.username),
                label: t('commands:tickle.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    id: bot.emotes.FOXY_CUPCAKE
                }
            })])]
        })
        endCommand();
    }
});

export default tickleCommand;