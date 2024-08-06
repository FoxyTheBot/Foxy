import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import AnimeExecutor from "../AnimeExecutor";

const AnimeCommand = createCommand({
    name: "anime",
    description: "[Utils] Searches for information about an anime",
    descriptionLocalizations: {
        "pt-BR": "[Utilitários] Pesquisa a informação de algum anime"
    },
    category: "util",
    supportsLegacy: false,
    options: [
        {
            name: 'anime',
            type: ApplicationCommandOptionTypes.String,
            description: 'Name of the anime you want to search',
            descriptionLocalizations: { 'pt-BR': 'Nome do anime que você quer pesquisar' },
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        AnimeExecutor(context, endCommand, t);
    }
});

export default AnimeCommand;