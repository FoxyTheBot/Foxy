import { bot } from "../../../FoxyLauncher";
import { MessageFlags } from "../../../utils/discord/Message";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class LanguageExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const language = context.getOption<string>('language', false);
        const userData = await bot.database.getUser((await context.getAuthor()).id);
        userData.userSettings.language = language;
        await userData.save();

        context.reply({
            content: context.makeReply(bot.emotes.FOXY_YAY, t(`commands:lang.changed`, { language: t(`commands:lang.languages.${language}`) })),
            flags: MessageFlags.EPHEMERAL
        })

        return endCommand();
    }
}