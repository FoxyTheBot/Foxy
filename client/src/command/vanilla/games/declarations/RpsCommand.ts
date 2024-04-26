import { createCommand } from "../../../structures/createCommand";
import RpsButtonExecutor from "../components/RpsButtonExecutor";
import RpsExecutor from "../RpsExecutor";

const RpsCommand = createCommand({
    name: 'rps',
    description: "[Games] Play rock, paper or scissors with Foxy",
    descriptionLocalizations: {
        "pt-BR": "[Jogos] Jogue pedra, papel ou tesoura com a Foxy"
    },
    category: 'games',
    commandRelatedExecutions: [RpsButtonExecutor],
    execute: async (context, endCommand, t) => {
        RpsExecutor(context, endCommand, t);
    }
});

export default RpsCommand;
