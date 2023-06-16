import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../structures/commands/createCommand";
import { User } from "discordeno/transformers";
import { bot } from "../..";

const RateWaifuCommand = createCommand({
    name: "rate",
    nameLocalizations: {
        "pt-BR": "avaliar"
    },
    description: "[Entertainment] Rate a waifu",
    descriptionLocalizations: {
        "pt-BR": "[Entretenimento] Avalie uma waifu"
    },
    category: "fun",
    options: [{
        name: "user",
        nameLocalizations: {
            "pt-BR": "usuário"
        },
        description: "The user to rate",
        descriptionLocalizations: {
            "pt-BR": "O usuário a ser avaliado",
        },
        type: ApplicationCommandOptionTypes.User,
        required: true
    }],

    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');

        const result = Math.floor(Math.random() * 10) + 1;
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_THINK, t('commands:rate.result', { user: await bot.foxyRest.getUserDisplayName(user.id), rate: result.toString() }))
        });

        endCommand();
    }
})

export default RateWaifuCommand;