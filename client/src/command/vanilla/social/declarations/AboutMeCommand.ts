import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import AboutMeExecutor from "../AboutMeExecutor";

const AboutMeCommand = createCommand({
    name: "aboutme",
    nameLocalizations: {
        "pt-BR": "sobremim"
    },
    description: "[Social] Set your profile about me",
    descriptionLocalizations: {
        "pt-BR": "[Social] Defina o sobre mim do seu perfil"
    },
    category: "social",
    supportsLegacy: true,
    options: [
        {
            name: "text",
            nameLocalizations: {
                'pt-BR': 'texto',
            },
            description: "The text you want to set",
            descriptionLocalizations: {
                "pt-BR": "O texto que você quer definir"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        AboutMeExecutor(context, endCommand, t);
    }
});

export default AboutMeCommand;