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
    category: "games",

    execute: async (context, endCommand, t) => {
        CoinflipExecutor(context, endCommand, t);
    }
});

export default CoinflipCommand;