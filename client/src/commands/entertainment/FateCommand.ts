import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { User } from "discordeno/transformers";
import { bot } from "../../index";

const FateCommand = createCommand({
name: 'fate',
    description: "[📺] Qual o seu destino com a pessoa",
    descriptionLocalizations: {
        "en-US": "[📺] What is your fate with the person"
    },
    category: 'fun',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Usuário que você quer prever o destino",
            descriptionLocalizations: {
                "en-US": "User you want to predict the fate"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');
    
        if (!user) {
            context.sendReply({
                content: context.makeReply(bot.emotes.scared, t('commands:global.noUser'))
            })
        }

        const list = [
            t('commands:fate.couple'),
            t('commands:fate.friend'),
            t('commands:fate.lover'),
            t('commands:fate.enemy'),
            t('commands:fate.sibling'),
            t('commands:fate.parent'),
            t('commands:fate.married')
        ]

        const rand = list[Math.floor(Math.random() * list.length)];
        await context.sendReply({
            content: context.makeReply(bot.emotes.success, t('commands:fate.result', { user: context.author.id.toString(), fate: rand, mention: user.id.toString() }))
        });

        endCommand();
    }
});

export default FateCommand;