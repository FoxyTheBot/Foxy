import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext"

export default async function CoinflipExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const coinflip = ["heads", "tails"];
    const coin = coinflip[Math.floor(Math.random() * coinflip.length)];

    context.sendReply({ content: `${t("commands:coinflip.flipped")} **${t(`commands:coinflip.${coin}`)}**` })
    endCommand();
}