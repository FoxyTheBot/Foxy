import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default class McskinCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mcskin",
            description: "Get the skin of a minecraft player",
            category: "mine",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("mcskin")
                .setDescription("[⛏ Mine] Get the skin of a minecraft player")
        });
    }

    async execute(interaction, t) {
        const user = interaction.options.getString("player");
        if (user.length > 20) return interaction.editReply(t('commands:mcskin.tooLong'));

        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(t('commands:mcskin.title', { user: user }))
            .setImage(`https://mc-heads.net/body/${user}`)

        await interaction.editReply({ embeds: [embed] });
    }
}