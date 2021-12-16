const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class CoinflipCommand extends Command {
    constructor(client) {
        super(client, {
            name: "coinflip",
            description: "Joga uma moeda.",
            category: "utils",
            data: new SlashCommandBuilder()
                .setName("coinflip")
                .setDescription("[🛠 Utils] Joga uma moeda.")
        });
    }

    async execute(interaction) {
        const coinflip = ["cara", "coroa"];
        const random = Math.floor(Math.random() * coinflip.length);

        await interaction.reply(`A moeda caiu em **${coinflip[random]}**!`);
    }
}