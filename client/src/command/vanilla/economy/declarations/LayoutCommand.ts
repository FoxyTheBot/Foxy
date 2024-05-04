import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { lylist } from '../../../../structures/json/layoutList.json';
import LayoutExecutor from "../LayoutExecutor";

const choices = lylist.map(data => Object({ name: data.name, nameLocalizations: data.nameLocalizations, value: data.id }));
const LayoutCommand = createCommand({
    name: "layout",
    description: "[Economy] Change your profile layout",
    descriptionLocalizations: {
        "pt-BR": "[Economia] Mude o layout do seu perfil"
    },
    category: "economy",
    options: [
        {
            name: "set",
            nameLocalizations: {
                "pt-BR": "definir"
            },
            description: "[Economy] Set your profile layout",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Defina o layout do seu perfil"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "layout",
                    nameLocalizations: {
                        "pt-BR": "layout"
                    },
                    description: "Choose your profile layout",
                    descriptionLocalizations: {
                        "pt-BR": "Escolha o layout do seu perfil"
                    },
                    type: ApplicationCommandOptionTypes.String,
                    choices: choices,
                    required: true
                }
            ]
        }
    ],
    execute: async (context, endCommand, t) => {
        LayoutExecutor(context, endCommand, t);
    }
});

export default LayoutCommand;