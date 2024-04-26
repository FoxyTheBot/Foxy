import { createCommand } from '../../../structures/createCommand';
import * as Canvas from 'canvas';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { getUserAvatar } from "../../../../utils/discord/User";
import { User } from 'discordeno/transformers';
import { serverURL } from '../../../../../config.json';
import GirlFriendExecutor from '../GirlfriendExecutor';

const GirlfriendCommand = createCommand({
    name: "girlfriend",
    description: "[Image] Who is your girlfriend?",
    descriptionLocalizations: {
        "pt-BR": "[Imagem] Quem é a sua namorada?"
    },
    category: "image",
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Mention the user (or not...)",
            descriptionLocalizations: {
                "pt-BR": "Mencione o usuário (ou não...)"
            },
            type: ApplicationCommandOptionTypes.User,
            required: false
        }
    ],
    execute: async (context, endCommand, t) => {
        GirlFriendExecutor(context, endCommand, t);
    }
});

export default GirlfriendCommand;