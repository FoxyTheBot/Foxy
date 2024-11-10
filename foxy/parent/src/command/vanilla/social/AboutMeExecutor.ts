import { MessageFlags } from "../../../utils/discord/Message";
import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class AboutMeExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const text = context.interaction ? await context.getOption<string>('text', false) : context.getMessage(1, true);
        const userData = await bot.database.getUser((await context.getAuthor()).id);

        if (!text) {
            context.reply({ content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:aboutme.noText")) });
            return endCommand();
        }

        if (text.length > 177) {
            context.reply({ content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:aboutme.tooLong", { length: text.length.toString() })) });
            return endCommand();
        }

        context.reply({
            content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:aboutme.set", { aboutme: text })),
            flags: MessageFlags.EPHEMERAL
        })
        userData.userProfile.aboutme = text;
        await userData.save();
        return endCommand();
    }
}