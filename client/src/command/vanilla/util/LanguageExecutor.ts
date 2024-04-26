import { bot } from "../../..";
import { MessageFlags } from "../../../utils/discord/Message";
import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";

export default async function LanguageExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const language = context.getOption<string>('language', false);
    const userData = await bot.database.getUser(context.author.id);
    userData.language = language;
    await userData.save();

    context.sendReply({
        content: t(`commands:lang.changed`, { language: t(`commands:lang.languages.${language}`) }),
        flags: MessageFlags.EPHEMERAL
    })

    endCommand();
}