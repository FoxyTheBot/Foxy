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
    supportsLegacy: false,
    commandRelatedExecutions: [RpsButtonExecutor],
    execute: async (context, endCommand, t) => {
        new RpsExecutor().execute({ context, endCommand, t });
    },
});

export default RpsCommand;
