import { ApplicationCommandTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import ProfileExecutor from "../ProfileExecutor";

const ViewUserProfileCommand = createCommand({
    name: "View User Profile",
    nameLocalizations: {
        "pt-BR": "Ver Perfil do Usuário"
    },
    description: "View the profile of a user",
    descriptionLocalizations: {
        "pt-BR": "Veja o perfil de um usuário"
    },
    category: "social",
    supportsLegacy: false,
    type: ApplicationCommandTypes.User,

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        ProfileExecutor(context, endCommand, t);
    }
});

export default ViewUserProfileCommand;