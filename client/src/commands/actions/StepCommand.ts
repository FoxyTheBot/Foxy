import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { ButtonStyles } from 'discordeno/types';
import { User } from 'discordeno/transformers';
import { createEmbed } from '../../utils/discord/Embed';
import { createActionRow, createButton, createCustomId } from '../../utils/discord/Component';
import { bot } from '../../index';

const embed = createEmbed({});

const StepCommand = createCommand({
    name: 'step',
    nameLocalizations: {
        'pt-BR': 'pisar'
    },
    description: '[Roleplay] Step on someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Dê uma pisada em alguém"
    },
    category: 'roleplay',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to step on",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja pisar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        const stepGif: any = await context.getImage("step");

        embed.title = t('commands:step.success', { user: user.username, author: context.author.username }),
            embed.image = {
                url: stepGif.url
            }

        context.sendReply({
            embeds: [embed],
        })
        endCommand();
    }
});

export default StepCommand;