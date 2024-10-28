import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import EminemExecutor from "../8MileExecutor";

const EminemCommand = createCommand({
    name: "8mile",
    description: "Generates an vídeo with a scene from the movie 8 Mile",
    descriptionLocalizations: {
        "pt-BR": "Gera um vídeo com uma cena do filme 8 Mile e um áudio customizado"
    },
    category: "image",

    options: [{
        name: "video_or_audio",
        nameLocalizations: {
            "pt-BR": "video_ou_audio"
        },
        description: "Video or Audio to be used in the video",
        descriptionLocalizations: {
            "pt-BR": "Vídeo ou Áudio a ser usado no vídeo"
        },
        type: ApplicationCommandOptionTypes.Attachment,
        required: true
    }],

    execute: async(context: UnleashedCommandExecutor, endCommand, t) => {
        new EminemExecutor().execute(context, endCommand, t);
    }
});

export default EminemCommand;