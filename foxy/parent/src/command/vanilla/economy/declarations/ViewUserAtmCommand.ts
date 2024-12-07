import { ApplicationCommandTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import AtmExecutor from "../AtmExecutor";

const ViewUserAtmCommand = createCommand({
    name: "View User Cakes",
    nameLocalizations: {
        "pt-BR": "Ver Cakes do Usuário"
    },
    category: "economy",
    description: "View the amount of cakes a user has",
    descriptionLocalizations: {
        "pt-BR": "Veja a quantidade de cakes que um usuário possui"
    },
    type: ApplicationCommandTypes.User,

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        new AtmExecutor().execute({ context, endCommand, t });
    }
});

export default ViewUserAtmCommand;