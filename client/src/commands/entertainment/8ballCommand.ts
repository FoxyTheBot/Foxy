import { createCommand} from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';

const eightBallCommand = createCommand({
name: '8ball',
    description: '[🎮] Pergunte algo para a Foxy',
    descriptionLocalizations: {
        'en-US': '[🎮] Ask something to Foxy'
    },
    category: 'games',
    options: [
        {
            name: 'question',
            nameLocalizations: {
                'pt-BR': 'pergunta'
            },
            description: 'Pergunta que você quer fazer',
            descriptionLocalizations: {
                'en-US': 'Question you want to ask'
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],
    execute: async (ctx, endCommand, t) => {
        const results = [
            t('commands:8ball.yes'),
            t('commands:8ball.no'),
            t('commands:8ball.maybe'),
            t('commands:8ball.idk'),
            t('commands:8ball.idk2'),
            t('commands:8ball.probablyyes'),
            t('commands:8ball.probablyno'),
            t('commands:8ball.probably')
        ];

        const result = results[Math.floor(Math.random() * results.length)];

        ctx.foxyReply({
            content: ctx.makeReply('🎱', result)
        });
        endCommand();
    }
});

export default eightBallCommand;