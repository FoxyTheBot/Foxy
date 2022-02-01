import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

export default class McbodyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mcbody",
            description: "Get the body of a minecraft player",
            category: "mine",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("mcbody")
                .setDescription("[⛏ Mine] Get the body of a minecraft player")
                .addStringOption(option => option.setName("player").setRequired(true).setDescription("The player you want to get the body of"))
        });
    }

    async execute(interaction, t) {
        const user = interaction.options.getString("player");
        if (user.length > 20) return interaction.editReply(t('commands:mcbody.tooLong'));

        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(t('commands:mcbody.title', { user: user }))
            .setImage(`https://mc-heads.net/body/${user}`)

        await interaction.editReply({ embeds: [embed] });
    }
}