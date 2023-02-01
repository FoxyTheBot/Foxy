import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { User } from "discordeno/transformers";
import { bot } from "../../index";

const FateCommand = createCommand({
    path: '',
    name: 'fate',
    description: "Qual o seu destino com a pessoa",
    descriptionLocalizations: {
        "en-US": "What is your fate with the person"
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
    authorDataFields: [],

    execute: async (ctx, finishCommand, t) => {
        const user = ctx.getOption<User>('user', 'users');
    
        if (!user) {
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.scared, t('commands:global.noUser'))
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
        await ctx.foxyReply({
            content: ctx.makeReply(bot.emotes.success, t('commands:fate.result', { user: ctx.author.id, fate: rand, mention: user.id }))
        });

        finishCommand();
    }
});

export default FateCommand;