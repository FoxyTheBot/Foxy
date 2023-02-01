import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../structures/commands/createCommand";

const RpsCommand = createCommand({
    path: '',
    name: 'rps',
    description: "Jogue pedra, papel ou tesoura com a Foxy",
    descriptionLocalizations: {
        "en-US": "Play rock, paper or scissors with Foxy"
    },
    category: 'fun',
    options: [
        {
            name: "choice",
            nameLocalizations: {
                "pt-BR": "escolha"
            },
            description: "Escolha entre pedra, papel ou tesoura",
            descriptionLocalizations: {
                "en-US": "Choose between rock, paper or scissors"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        },
    ],
    authorDataFields: [],

    execute: async (ctx, finishCommand, t) => {
        const string = ctx.getOption<string>('choice', false);
        const acceptedReplies = [t('commands:rps.replies.rock'), t('commands:rps.replies.paper'), t('commands:rps.replies.scissors')];

        const random = Math.floor((Math.random() * acceptedReplies.length));
        const result = acceptedReplies[random];

        if (!acceptedReplies.includes(string)) {
            return ctx.foxyReply({
                content: ctx.prettyReply("❌", t('commands:rps.invalidChoice', { choice: acceptedReplies.join(', ') }))
            });
        }
        if (result === string) {
            return ctx.foxyReply({
                content: ctx.prettyReply("❌", t('commands:rps.tie'))
            });
        }

        switch (string) {
            case t('commands:rps.replies.rock'): {
                if (result === t('commands:rps.replies.paper')) {
                    ctx.foxyReply({
                        content: t('commands:rps.clientWon', { result: result })
                    })
                    finishCommand();
                }
                ctx.foxyReply({
                    content: t('commands:rps.won3')
                })
                finishCommand();
                break;
            }
            case t('commands:rps.replies.paper'): {
                if (result === t('commands:rps.replies.scissors')) {
                    ctx.foxyReply({
                        content: t('commands:rps.clientWon', { result: result })
                    })
                    finishCommand();
                }
                ctx.foxyReply({
                    content: t('commands:rps.won2')
                });

                finishCommand();
            }
            case t('commands:rps.replies.scissors'): {
                if (result === t('commands:rps.replies.rock')) {
                    ctx.foxyReply({
                        content: t('commands:rps.clientWon', { result: result })
                    });
                    finishCommand();
                }
                ctx.foxyReply({
                    content: t('commands:rps.won1')
                });
                finishCommand();
            }
        }
    }
});

export default RpsCommand;