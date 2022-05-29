import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class CoinflipCommand extends Command {
    constructor(client) {
        super(client, {
            name: "coinflip",
            description: "Flip a coin",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("coinflip")
                .setDescription("[🛠 Utils] Flip a coin")
        });
    }

    async execute(interaction, t): Promise<void> {
        const coinflip = ["heads", "tails"];
        const coin = coinflip[Math.floor(Math.random() * coinflip.length)];

        await interaction.reply(`${t("commands:coinflip.flipped")} **${t(`commands:coinflip.${coin}`)}**`);
    }
}