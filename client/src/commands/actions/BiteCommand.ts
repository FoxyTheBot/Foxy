import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { User } from 'discordeno/transformers';
import { createEmbed } from '../../utils/discord/Embed';

const embed = createEmbed({});

const BiteCommand = createCommand({
    name: 'bite',
    nameLocalizations: {
        'pt-BR': 'morder'
    },
    description: '[Roleplay] Bite someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Morda alguém"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to bite",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja morder"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const biteGif: any = await context.getImage("bite");

        embed.title = t('commands:bite.success', { user: user.username, author: context.author.username }),
            embed.image = {
                url: biteGif.url
            }

        context.sendReply({
            embeds: [embed],
        })
        endCommand();
    }
});

export default BiteCommand;