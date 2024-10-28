import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";

export default async function NotStonksExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const content = context.getOption<string>("text", false);
    context.sendDefer();

    const notStonksImage = await bot.generators.generateNotStonksImage(content);

    context.sendReply({
        file: {
            name: "not_stonks.png",
            blob: notStonksImage
        }
    })
    endCommand();
}