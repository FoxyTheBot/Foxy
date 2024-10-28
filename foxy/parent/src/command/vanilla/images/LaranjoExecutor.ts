import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";

export default async function LaranjoExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const content = context.getOption<string>("text", false);
    context.sendDefer();

    const laranjoImage = await bot.generators.generateLaranjoImage(content);

    context.sendReply({
        file: {
            name: "laranja_laranjo.png",
            blob: laranjoImage
        }
    });
    endCommand();
}