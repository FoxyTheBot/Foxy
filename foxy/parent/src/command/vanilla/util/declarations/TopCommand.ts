import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import TopExecutor from "../TopExecutor";

const TopCommand = createCommand({
    name: "top",
    description: "[Utils] See the rank of cakes",
    descriptionLocalizations: {
        "pt-BR": "[Utilitários] Veja o rank de cakes"
    },
    category: "util",
    options: [
        {
            name: "cakes",
            description: "[Economy] See the cakes rank",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Veja o rank de cakes"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        },
        {
            name: "commands",
            nameLocalizations: {
                "pt-BR": "comandos"
            },
            description: "[Utils] See the commands rank",
            descriptionLocalizations: {
                "pt-BR": "[Utilitários] Veja o rank de comandos"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        }],

    async execute(context, endCommand, t) {
        new TopExecutor().execute({ context, endCommand, t });
    }
})

export default TopCommand;