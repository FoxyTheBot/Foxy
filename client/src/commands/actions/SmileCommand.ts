import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';

const embed = createEmbed({});

const SmileCommand = createCommand({
    name: 'smile',
    nameLocalizations: {
        'pt-BR': 'sorrir'
    },
    description: '[Roleplay] * smiling *',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] * sorrindo *"
    },
    category: 'roleplay',

    execute: async (context, endCommand, t) => {
        const smileGif: any = await context.getImage("smile");
        embed.title = t('commands:smile.smiling', { author: context.author.username }),
            embed.image = {
                url: smileGif.url
            }

        context.sendReply({
            embeds: [embed],
        })
        endCommand();
    }
});

export default SmileCommand;