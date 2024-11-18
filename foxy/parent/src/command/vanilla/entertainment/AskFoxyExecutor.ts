import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class AskFoxyExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const results = [
            t('commands:8ball.yes'),
            t('commands:8ball.no'),
            t('commands:8ball.maybe'),
            t('commands:8ball.idk'),
            t('commands:8ball.idk2'),
            t('commands:8ball.probablyyes'),
            t('commands:8ball.probablyno'),
            t('commands:8ball.probably')
        ];

        const result = results[Math.floor(Math.random() * results.length)];
        
        context.reply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, result)
        });
        return endCommand();
    }
}