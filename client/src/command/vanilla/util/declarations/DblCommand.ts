import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import DblExecutor from "../DblExecutor";

const DblCommand = createCommand({
    name: 'dbl',
    description: '[Utils] Vote Foxy on top.gg',
    descriptionLocalizations: {
        "pt-BR": '[Utils] Vote na Foxy no top.gg'
    },
    category: 'util',
    options: [
        {
            name: "upvote",
            description: "[Utils] Vote for Foxy on top.gg",
            descriptionLocalizations: {
                "pt-BR": "[Utilitários] Vote na Foxy no top.gg"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        }
    ],

    execute: async (context, endCommand, t) => {
        DblExecutor(context, endCommand, t);
    }
});

export default DblCommand;