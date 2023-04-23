import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { ButtonStyles } from 'discordeno/types';
import { User } from 'discordeno/transformers';
import { createEmbed } from '../../utils/discord/Embed';
import { createActionRow, createButton, createCustomId } from '../../utils/discord/Component';
import { bot } from '../../index';
import LickExecutor from "../../utils/commands/executors/actions/LickExecutor";
import { MessageFlags } from '../../utils/discord/Message';

const embed = createEmbed({});

const LickCommand = createCommand({
    name: 'lick',
    nameLocalizations: {
        'pt-BR': 'lamber'
    },
    description: '[Roleplay] Lick someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Lamba alguém"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to lick",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja lamber"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [LickExecutor],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const lickGif: any = await context.getImage("lick");

        embed.title = t('commands:lick.success', { user: user.username, author: context.author.username }),
            embed.image = {
                url: lickGif.url
            }

        if (user.id === bot.clientId) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:lick.bot')),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }
        context.sendReply({
            embeds: [embed],
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, context.commandId, user.username),
                label: t('commands:lick.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    id: bot.emotes.FOXY_CUPCAKE
                }
            })])]
        })
        endCommand();
    }
});

export default LickCommand;