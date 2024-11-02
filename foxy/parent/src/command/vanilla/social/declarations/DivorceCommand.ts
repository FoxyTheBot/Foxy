import { createCommand } from "../../../structures/createCommand";
import DivorceExecutor from "../DivorceExecutor";
import DivorceButtonExecutor from "../components/DivorceButtonExecutor";

const DivorceCommand = createCommand({
    name: 'divorce',
    nameLocalizations: {
        "pt-BR": "divorciar"
    },
    description: "[Social] Divorce your partner",
    descriptionLocalizations: {
        "pt-BR": "[Social] Divorcie-se de seu parceiro"
    },
    category: "social",
    supportsLegacy: false,
    commandRelatedExecutions: [DivorceButtonExecutor],

    execute: async (context, endCommand, t) => {
        new DivorceExecutor().execute(context, endCommand, t);
    }
});

export default DivorceCommand;