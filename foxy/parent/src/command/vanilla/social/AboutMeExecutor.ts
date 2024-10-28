import { MessageFlags } from "../../../utils/discord/Message";
import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function AboutMeExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const text = await context.getOption<string>("text", false);
    const userData = await bot.database.getUser(context.author.id);

    if (text.length > 177) {
        context.sendReply({ content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:aboutme.tooLong", { length: text.length.toString() })) });
        return endCommand();
    }

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:aboutme.set", { aboutme: text })),
        flags: MessageFlags.EPHEMERAL
    })
    userData.userProfile.aboutme = text;
    await userData.save();
    endCommand();
}