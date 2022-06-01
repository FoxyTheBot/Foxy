import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import NekosLife from "nekos.life";

export default class HugCommand extends Command {
    constructor(client) {
        super(client, {
            name: "hug",
            description: "Hugs someone",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("hug")
                .setDescription("[Roleplay] Hug someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to hug"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const neko = new NekosLife();
        const user = await interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

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
                    .setEmoji("<:ztLove:978732042160332850>")
            )

        await interaction.reply({ embeds: [hugEmbed], components: [row] });

        const filter = i => i.customId === 'primary' && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5000, max: 1 });

        collector.on('collect', async i => {
            const hugEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(t('commands:hug.success', { user: interaction.user.username, author: user.username }))
                .setImage(img2.url)
            await interaction.followUp({ embeds: [hugEmbed] });
            i.deferUpdate();
            return collector.stop();
        });
    }
}