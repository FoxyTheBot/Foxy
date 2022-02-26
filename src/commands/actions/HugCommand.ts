import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import nekosLife from "nekos.life";

export default class HugCommand extends Command {
    constructor(client) {
        super(client, {
            name: "hug",
            description: "Hugs someone",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("hug")
                .setDescription("[🎮 Roleplay] Hug someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to hug"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const neko = new nekosLife();
        const user = await interaction.options.getUser("user");

        const img = await neko.sfw.hug();
        const img2 = await neko.sfw.hug();

        const hugEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(t('commands:hug.success', { user: user.username, author: interaction.user.username }))
            .setImage(img.url)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("primary")
                    .setLabel(t("commands:hug.button"))
                    .setStyle("PRIMARY")
            )

        await interaction.editReply({ embeds: [hugEmbed], components: [row] });

        const filter = i => i.customId === 'primary' && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

        collector.on('collect', async i => {
            const hugEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(t('commands:hug.success', { user: interaction.user.username, author: user.username }))
                .setImage(img2.url)
            await interaction.followUp({ embeds: [hugEmbed] });
            i.deferUpdate();
        });
    }
}