import { createCommand } from '../../structures/commands/createCommand';
import { createEmbed } from '../../utils/discord/Embed';

const embed = createEmbed({});

const CryCommand = createCommand({
    name: 'cry',
    nameLocalizations: {
        'pt-BR': 'chorar'
    },
    description: '[Roleplay] Hug someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Abraçe alguém"
    },
    category: 'roleplay',

    execute: async (context, endCommand, t) => {
        const cryGif: any = await context.getImage("cry");
        embed.title = t('commands:cry.crying'),
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