import { createCommand } from '../../structures/commands/createCommand';
import * as Canvas from 'canvas';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { getUserAvatar } from "../../utils/discord/User";
import { User } from 'discordeno/transformers';

const GirlfriendCommand = createCommand({
    name: "girlfriend",
    description: "[🖼] - Quem é a sua namorada?",
    descriptionLocalizations: {
        "en-US": "[🖼] - Who is your girlfriend?"
    },
    category: "image",
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"  
            },
            description: "Mencione o usuário (ou não...)",
            descriptionLocalizations: {
                "en-US": "Mention the user (or not...)"
            },
            type: ApplicationCommandOptionTypes.User,
            required: false
        }
    ],
    execute: async (ctx, endCommand, t) => {
        const user = ctx.getOption<User>("user", "users");
        
        var avatar;
        if (!user) {
            avatar = "https://cdn.discordapp.com/attachments/784852925989126215/862127934332338176/unknown.png";
        } else {
            avatar = getUserAvatar(user, { size: 2048 });
        }

        const background = await Canvas.loadImage("http://localhost:8080/memes/namorada.png");
        const avatarImg = await Canvas.loadImage(avatar);
        const canvas = Canvas.createCanvas(500, 510);
        const context = canvas.getContext('2d'); 
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        context.drawImage(avatarImg, 20, 170, 200, 200);

        const blob = new Blob([canvas.toBuffer()], { type: "image/png" });
        ctx.foxyReply({
            file: {
                name: "namorada.png",
                blob
            }
        });
        endCommand();
    }
});

export default GirlfriendCommand;