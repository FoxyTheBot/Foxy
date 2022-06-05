import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default class DblCommand extends Command {
    constructor(client) {
        super(client, {
            name: "upvote",
            description: "Vote Foxy in DBL",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("upvote")
                .setDescription("[Utils] Vote Foxy in DBL")
        });
    }

    async execute(interaction, t): Promise<void> {
        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(":sparkles: Discord Bot List")
            .setDescription(`<a:happy_shuffle:768500897483325493> ${t("commands:upvote.description")}`)

        await interaction.reply({ embeds: [embed] });
    }
}