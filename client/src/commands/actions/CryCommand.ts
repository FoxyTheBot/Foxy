import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';
import { bot } from '../..';

const embed = createEmbed({});

const CryCommand = createCommand({
    name: 'cry',
    nameLocalizations: {
        'pt-BR': 'chorar'
    },
    description: '[Roleplay] * crying *',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] * chorando *"
    },
    category: 'roleplay',

    execute: async (context, endCommand, t) => {
        const cryGif: any = await context.getImage("cry");
        embed.title = t('commands:cry.crying', { author: await bot.foxyRest.getUserDisplayName(context.author.id) }),
            embed.image = {
                url: cryGif.url
            }

        context.sendReply({
            embeds: [embed],
        })
        endCommand();
    }
});

export default CryCommand;