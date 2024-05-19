import { bot } from "../../../FoxyLauncher";
import { MessageFlags } from "../../../utils/discord/Message";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function LanguageExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const language = context.getOption<string>('language', false);
    const userData = await bot.database.getUser(context.author.id);
    userData.userSettings.language = language;
    await userData.save();

    context.sendReply({
        content: t(`commands:lang.changed`, { language: t(`commands:lang.languages.${language}`) }),
        flags: MessageFlags.EPHEMERAL
    })

    endCommand();
}