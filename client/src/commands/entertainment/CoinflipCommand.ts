import { createCommand } from "../../structures/commands/createCommand";

const CoinflipCommand = createCommand({
name: "caracoroa",
    nameLocalizations: {
        "en-US": "coinflip"
    },
    description: "[🎮] Jogue cara ou coroa",
    descriptionLocalizations: {
        "en-US": "[🎮] Play heads or tails"
    },
    category: "games",
    options: [],

    execute: async (ctx, endCommand, t) => {
        const coinflip = ["heads", "tails"];
        const coin = coinflip[Math.floor(Math.random() * coinflip.length)];

        ctx.foxyReply({ content: `${t("commands:coinflip.flipped")} **${t(`commands:coinflip.${coin}`)}**`})
        endCommand();
    }
});

export default CoinflipCommand;