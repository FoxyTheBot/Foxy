import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function CoinflipExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const coinflip = ["heads", "tails"];
    const coin = coinflip[Math.floor(Math.random() * coinflip.length)];

    context.reply({ content: `${t("commands:coinflip.flipped")} **${t(`commands:coinflip.${coin}`)}**` })
    endCommand();
}