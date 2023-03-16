import { createCommand } from "../../structures/commands/createCommand";

const CoinflipCommand = createCommand({
    name: "coinflip",
    nameLocalizations: {
        "pt-BR": "caracoroa"
    },
    description: "[Games] Play heads or tails",
    descriptionLocalizations: {
        "pt-BR": "[Jogos] Jogue cara ou coroa"
    },
    category: "games",
    options: [],

    execute: async (context, endCommand, t) => {
        const coinflip = ["heads", "tails"];
        const coin = coinflip[Math.floor(Math.random() * coinflip.length)];

        context.sendReply({ content: `${t("commands:coinflip.flipped")} **${t(`commands:coinflip.${coin}`)}**` })
        endCommand();
    }
});

export default CoinflipCommand;