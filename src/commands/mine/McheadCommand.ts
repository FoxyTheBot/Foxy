import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mchead",
            description: "Get the head of a minecraft player",
            category: "mine",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("mchead")
                .setDescription("[⛏ Mine] Get the head of a minecraft player")
        });
    }

    async execute(interaction, t) {
        const user = interaction.options.getString("player");
        if (user.length > 20) return interaction.editReply(t('commands:mchead.tooLong'));

        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(t('commands:mchead.title', { user: user }))
            .setImage(`https://mc-heads.net/head/${user}`)

        await interaction.editReply({ embeds: [embed] });
    }
}