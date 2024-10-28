import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";

export default async function StonksExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const content = context.getOption<string>("text", false);
    context.sendDefer();

    const stonksImage = await bot.generators.generateStonksImage(content);

    context.sendReply({
        file: {
            name: "stonks.png",
            blob: stonksImage
        }
    });

    endCommand();
}