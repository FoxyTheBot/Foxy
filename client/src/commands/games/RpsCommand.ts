import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../structures/commands/createCommand";
import { bot } from '../../index';

const RpsCommand = createCommand({
name: 'rps',
    description: "[Games] Play rock, paper or scissors with Foxy",
    descriptionLocalizations: {
        "pt-BR": "[Jogos] Jogue pedra, papel ou tesoura com a Foxy"
    },
    category: 'games',
    options: [
        {
            name: "choice",
            nameLocalizations: {
                "pt-BR": "escolha"
            },
            description: "[Games] Play rock, paper or scissors with Foxy",
            descriptionLocalizations: {
                "pt-BR": "[Jogos] Jogue pedra, papel ou tesoura com a Foxy"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        },
    ],

    execute: async (context, endCommand, t) => {
        const string = context.getOption<string>('choice', false);
        const acceptedReplies = [t('commands:rps.replies.rock'), t('commands:rps.replies.paper'), t('commands:rps.replies.scissors')];

        const random = Math.floor((Math.random() * acceptedReplies.length));
        const result = acceptedReplies[random];

        if (!acceptedReplies.includes(string)) {
            return context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:rps.invalidChoice', { choice: acceptedReplies.join(', ') }))
            });
        }
        if (result === string) {
            return context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:rps.tie'))
            });
        }

        switch (string) {
            case t('commands:rps.replies.rock'): {
                if (result === t('commands:rps.replies.paper')) {
                    context.sendReply({
                        content: t('commands:rps.clientWon', { result: result })
                    })
                    endCommand();
                }
                context.sendReply({
                    content: t('commands:rps.won3')
                })
                endCommand();
                break;
            }
            case t('commands:rps.replies.paper'): {
                if (result === t('commands:rps.replies.scissors')) {
                    context.sendReply({
                        content: t('commands:rps.clientWon', { result: result })
                    })
                    endCommand();
                }
                context.sendReply({
                    content: t('commands:rps.won2')
                });

                endCommand();
            }
            case t('commands:rps.replies.scissors'): {
                if (result === t('commands:rps.replies.rock')) {
                    context.sendReply({
                        content: t('commands:rps.clientWon', { result: result })
                    });
                    endCommand();
                }
                context.sendReply({
                    content: t('commands:rps.won1')
                });
                endCommand();
            }
        }
    }
});

export default RpsCommand;