import { ApplicationCommandTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import { bot } from "../../../../FoxyLauncher";
import ValorantStatsExecutor from "../ValorantStatsExecutor";

const ViewUserStatsCommand = createCommand({
    name: "View VALORANT Stats",
    nameLocalizations: {
        "pt-BR": "Ver Estatísticas do VALORANT"
    },
    description: "View the stats of a user in VALORANT",
    descriptionLocalizations: {
        "pt-BR": "Veja as estatísticas de um usuário no VALORANT"
    },
    type: ApplicationCommandTypes.User,
    category: "util",

    execute: async (context, endCommand, t ) => {
        ValorantStatsExecutor(bot, context, endCommand, t);
    }
})

export default ViewUserStatsCommand;