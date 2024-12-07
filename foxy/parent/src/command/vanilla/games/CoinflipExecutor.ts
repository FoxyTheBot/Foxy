import { ExecutorParams } from "../../structures/CommandExecutor";

export default class CoinflipExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const coinflip = ["heads", "tails"];
        const coin = coinflip[Math.floor(Math.random() * coinflip.length)];

        context.reply({ content: `${t("commands:coinflip.flipped")} **${t(`commands:coinflip.${coin}`)}**` })
        return endCommand();
    }
}