import { createCommand } from "../../../structures/createCommand";
import CoinflipExecutor from "../CoinflipExecutor";

const CoinflipCommand = createCommand({
    name: "coinflip",
    nameLocalizations: {
        "pt-BR": "caracoroa"
    },
    description: "[Games] Play heads or tails",
    descriptionLocalizations: {
        "pt-BR": "[Jogos] Jogue cara ou coroa"
    },
    aliases: ["caracoroa", "caraoucoroa"],
    supportsLegacy: true,
    category: "games",

    execute: async (context, endCommand, t) => {
        new CoinflipExecutor().execute({ context, endCommand, t });
    }
});

export default CoinflipCommand;