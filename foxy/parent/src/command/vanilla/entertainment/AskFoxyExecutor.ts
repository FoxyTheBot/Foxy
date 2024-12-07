import { bot } from "../../../FoxyLauncher";
import { ExecutorParams } from "../../structures/CommandExecutor";
export default class AskFoxyExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const results = [
            t('commands:EightBall.yes'),
            t('commands:EightBall.no'),
            t('commands:EightBall.maybe'),
            t('commands:EightBall.idk'),
            t('commands:EightBall.idk2'),
            t('commands:EightBall.probablyyes'),
            t('commands:EightBall.probablyno'),
            t('commands:EightBall.probably')
        ];
        
        const result = results[Math.floor(Math.random() * results.length)];
        
        context.reply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, result)
        });
        return endCommand();
    }
}