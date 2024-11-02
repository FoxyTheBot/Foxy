import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import { bot } from "../../../../FoxyLauncher";

export default class LaranjoExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const content = context.getOption<string>("text", false);
        context.sendDefer();

        const laranjoImage = await bot.rest.foxy.getArtistryImage("/memes/laranjo", {
            text: content
        });

        const file = new File([laranjoImage], "laranja_laranjo.png", { type: "image/png" });

        context.reply({
            file: {
                name: "laranja_laranjo.png",
                blob: file
            }
        });
        endCommand();
    }
}