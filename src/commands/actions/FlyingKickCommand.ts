import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

export default class FlyingKickCommand extends Command {
    constructor(client) {
        super(client, {
            name: "flying",
            description: "Do a flying kick.",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("flying")
                .setDescription("Do a flying kick")
                .addSubcommand(command => command.setName("kick").setDescription("Do a flying kick").addUserOption(option => option.setName("user").setDescription("The user you want to kick").setRequired(true)))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = await interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        if (user === interaction.user) return interaction.reply(t('commands:kick.self'))
        if (user === this.client.user) return interaction.reply(t('commands:kick.client'));

        const list = [
            "https://tenor.com/view/kick-anime-gif-7779674",
            "https://i.pinimg.com/originals/50/4c/92/504c92f4eda9d5664895870946a8ab03.gif",
            "https://c.tenor.com/KxmgDMI7B04AAAAd/anime-kick.gif",
            "http://25.media.tumblr.com/tumblr_m7ko8uljh71ql4klyo1_400.gif",
            "https://thumbs.gfycat.com/AgedGleamingArmadillo-max-1mb.gif"
        ]

        const rand = list[Math.floor(Math.random() * list.length)];

        const embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(t('commands:kick.success', { user: interaction.user.username, target: user.username }))
            .setImage(rand)

        await interaction.reply({ embeds: [embed] });

    }
}