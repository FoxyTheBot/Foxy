import { createCommand} from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { bot } from "../../index";

const eightBallCommand = createCommand({
name: '8ball',
    description: '[Entertainment] Ask something to Foxy',
    descriptionLocalizations: {
        'pt-BR': '[Entretenimento] Pergunte algo para a Foxy'
    },
    category: 'games',
    options: [
        {
            name: 'question',
            nameLocalizations: {
                'pt-BR': 'pergunta'
            },
            description: 'Question you want to ask',
            descriptionLocalizations: {
                'pt-BR': 'Pergunta que você quer fazer'
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],
    execute: async (context, endCommand, t) => {
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

        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, result)
        });
        endCommand();
    }
});

export default eightBallCommand;