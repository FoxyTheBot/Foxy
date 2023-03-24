import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';

const embed = createEmbed({});

const DanceCommand = createCommand({
    name: 'dance',
    nameLocalizations: {
        'pt-BR': 'dançar'
    },
    description: '[Roleplay] Dance with someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Dance com alguém"
    },
    category: 'roleplay',

    execute: async (context, endCommand, t) => {
        const danceGif: any = await context.getImage("dance");
        embed.title = t('commands:dance.dancing', { author: context.author.username }),
            embed.image = {
                url: danceGif.url
            }

        context.sendReply({
            embeds: [embed],
        })
        endCommand();
    }
});

export default DanceCommand;