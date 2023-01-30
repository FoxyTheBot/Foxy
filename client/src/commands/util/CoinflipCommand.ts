import { createCommand } from "../../structures/commands/createCommand";

const CoinflipCommand = createCommand({
    path: '',
    name: "caracoroa",
    nameLocalizations: {
        "en-US": "coinflip"
    },
    description: "Jogue cara ou coroa",
    descriptionLocalizations: {
        "en-US": "Play heads or tails"
    },
    category: "util",
    options: [],
    authorDataFields: [],

    execute: async (ctx, finishCommand, t) => {
        const coinflip = ["heads", "tails"];
        const coin = coinflip[Math.floor(Math.random() * coinflip.length)];

        ctx.foxyReply({ content: `${t("commands:coinflip.flipped")} **${t(`commands:coinflip.${coin}`)}**`})
        finishCommand();
    }
});

export default CoinflipCommand;