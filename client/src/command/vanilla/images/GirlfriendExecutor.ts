import * as Canvas from 'canvas';
import { getUserAvatar } from "../../../utils/discord/User";
import { User } from 'discordeno/transformers';
import { serverURL } from '../../../../config.json';
import ChatInputInteractionContext from '../../structures/ChatInputInteractionContext';

export default async function GirlFriendExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const user = context.getOption<User>("user", "users");

    var avatar;
    if (!user) {
        avatar = "https://cdn.discordapp.com/attachments/784852925989126215/862127934332338176/unknown.png";
    } else {
        avatar = getUserAvatar(user, { size: 2048 });
    }

    const background = await Canvas.loadImage(`${serverURL}/assets/commands/memes/namorada.png`);
    const avatarImg = await Canvas.loadImage(avatar);
    const canvas = Canvas.createCanvas(500, 510);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatarImg, 20, 170, 200, 200);

    const blob = new Blob([canvas.toBuffer()], { type: "image/png" });
    context.sendReply({
        file: {
            name: "namorada.png",
            blob
        }
    });
    endCommand();
}