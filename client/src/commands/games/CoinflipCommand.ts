import { createCommand } from "../../structures/commands/createCommand";

const CoinflipCommand = createCommand({
name: "caracoroa",
    nameLocalizations: {
        "en-US": "coinflip"
    },
    description: "[Jogos] Jogue cara ou coroa",
    descriptionLocalizations: {
        "en-US": "[Games] Play heads or tails"
    },
    category: "games",
    options: [],

    execute: async (context, endCommand, t) => {
        const coinflip = ["heads", "tails"];
        const coin = coinflip[Math.floor(Math.random() * coinflip.length)];

        context.sendReply({ content: `${t("commands:coinflip.flipped")} **${t(`commands:coinflip.${coin}`)}**`})
        endCommand();
    }
});

export default CoinflipCommand;