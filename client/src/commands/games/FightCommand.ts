import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';
import { bot } from '../../index';
import { createActionRow, createButton, createCustomId } from '../../utils/discord/Component';
import { ApplicationCommandOptionTypes, ButtonStyles } from 'discordeno/types';
import { User } from 'discordeno/transformers';
import FightExecutor from '../../utils/commands/executors/games/FightExecutor';
import FightDeclineExecutor from '../../utils/commands/executors/games/FightDeclineExecutor';
import FightActionExecutor from '../../utils/commands/executors/games/FightActionExecutor';

const FightCommand = createCommand({
    name: 'fight',
    nameLocalizations: {
        'pt-BR': 'lutar'
    },
    description: "[Games] Fight with someone",
    descriptionLocalizations: {
        "pt-BR": "[Jogos] Lute com alguém"
    },
    category: "games",
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "The user you want to fight",
            descriptionLocalizations: {
                "pt-BR": "O usuário que você deseja lutar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [FightExecutor, FightDeclineExecutor, FightActionExecutor],
    
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');

        if (user.id === context.author.id) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:fight.cantFightYourself'))
            });

            return endCommand();
        }
        
        context.sendReply({
            embeds: [createEmbed({
                title: t('commands:fight.fight'),
                description: t('commands:fight.description', { user: user.username }),
            })],
            components: [createActionRow([createButton({
                label: t('commands:fight.accept'),
                style: ButtonStyles.Success,
                customId: createCustomId(0, user.id, context.commandId, user.id, user.username)
            }), createButton({
                label: t('commands:fight.decline'),
                style: ButtonStyles.Danger,
                customId: createCustomId(1, user.id, context.commandId)
            })])]
        });

        endCommand();
    }
});

export default FightCommand;