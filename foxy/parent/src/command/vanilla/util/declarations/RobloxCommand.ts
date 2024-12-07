import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import RobloxExecutor from "../RobloxExecutor";

const RobloxCommand = createCommand({
    name: "roblox",
    description: "[Utils] Commands related to Roblox",
    descriptionLocalizations: {
        "pt-BR": "[Utilitários] Comandos relacionados ao Roblox"
    },
    category: "util",
    supportsLegacy: true,
    options: [{
        name: "search",
        nameLocalizations: {
            "pt-BR": "buscar"
        },
        description: "Search for a user on Roblox",
        descriptionLocalizations: {
            "pt-BR": "Busque um usuário no Roblox"
        },
        type: ApplicationCommandOptionTypes.SubCommandGroup,
        options: [{
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "[Roblox] Search for a user on Roblox",
            descriptionLocalizations: {
                "pt-BR": "[Roblox] Busque um usuário no Roblox"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "username",
                description: "The username of the Roblox account",
                descriptionLocalizations: {
                    "pt-BR": "O nome de usuário da conta Roblox"
                },
                type: ApplicationCommandOptionTypes.String,
                required: true
            }]
        }]
    }],
    execute: async (context, endCommand, t) => {
        new RobloxExecutor().execute({ context, endCommand, t });
    }
});

export default RobloxCommand;