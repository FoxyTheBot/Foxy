import * as Canvas from 'canvas';
import { getUserAvatar } from "../../../utils/discord/User";
import { User } from 'discordeno/transformers';
import { serverURL } from '../../../../config.json';
import UnleashedCommandExecutor from '../../structures/UnleashedCommandExecutor';
import { bot } from '../../../FoxyLauncher';

export default async function GirlFriendExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>("user", "users");

    if (!user) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:global.noUser')),
            flags: 64
        });

        return endCommand();
    }
    
    const avatar = getUserAvatar(user, { size: 2048 });
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