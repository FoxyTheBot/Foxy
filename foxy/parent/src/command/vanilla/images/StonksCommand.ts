import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";

export default async function StonksExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    context.sendDefer();
    const content = context.getOption<string>("text", false);

    const stonksImage = await bot.rest.foxy.getArtistryImage("/memes/stonks", {
        text: content
    });

    const file = new File([stonksImage], "stonks.png", { type: "image/png" });

    context.sendReply({
        file: {
            name: "stonks.png",
            blob: file
        }
    });

    endCommand();
}