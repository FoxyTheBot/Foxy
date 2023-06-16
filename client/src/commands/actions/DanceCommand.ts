import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';
import { bot } from '../..';

const embed = createEmbed({});

const DanceCommand = createCommand({
    name: 'dance',
    nameLocalizations: {
        'pt-BR': 'dançar'
    },
    description: '[Roleplay] * grooving *',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] * dançando *"
    },
    category: 'roleplay',

    execute: async (context, endCommand, t) => {
        const danceGif: any = await context.getImage("dance");
        embed.title = t('commands:dance.dancing', { author: await bot.foxyRest.getUserDisplayName(context.author.id) }),
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