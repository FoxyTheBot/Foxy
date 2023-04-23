import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { ButtonStyles } from 'discordeno/types';
import { User } from 'discordeno/transformers';
import { createEmbed } from '../../utils/discord/Embed';
import { createActionRow, createButton, createCustomId } from '../../utils/discord/Component';
import { bot } from '../../index';
import KissExecutor from "../../utils/commands/executors/actions/KissExecutor";
import { MessageFlags } from '../../utils/discord/Message';

const embed = createEmbed({});

const KissCommand = createCommand({
    name: 'kiss',
    nameLocalizations: {
        'pt-BR': 'beijar'
    },
    description: '[Roleplay] Kiss someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Beije alguém"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to kiss",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja beijar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [KissExecutor],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const kissGif: any = await context.getImage("kiss");

        if (user.id === bot.id) {
            context.sendReply({
                content: t('commands:kiss.bot'),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }

        if (user.id === context.author.id) {
            context.sendReply({
                content: t('commands:kiss.self'),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }

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
                    id: bot.emotes.FOXY_CUPCAKE
                }
            })])]
        })
        endCommand();
    }
});

export default KissCommand;