import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import RateWaifuExecutor from "../RateWaifuExecutor";

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
    aliases: ["ratewaifu", "avaliarwaifu"],
    supportsLegacy: true,
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
        new RateWaifuExecutor().execute({ context, endCommand, t });
    }
})

export default RateWaifuCommand;