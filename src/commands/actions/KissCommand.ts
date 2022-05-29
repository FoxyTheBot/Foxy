import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import NekosLife from "nekos.life";

export default class KissCommand extends Command {
    constructor(client) {
        super(client, {
            name: "kiss",
            description: "Kiss someone",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("kiss")
                .setDescription("[🎮 Roleplay] Kiss someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to kiss"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const neko = new NekosLife();

        const img = await neko.sfw.kiss();
        const img2 = await neko.sfw.kiss();
        const user = await interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        if (user == this.client.user) return interaction.reply(t('commands:kiss.self'));

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("primary")
                    .setLabel(t("commands:kiss.button"))
                    .setStyle("PRIMARY")
            )

        const embed = new MessageEmbed()
            .setColor('#06c5ef')
            .setDescription(t('commands:kiss.success', { user: user.username, author: interaction.user.username }))
            .setImage(img.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'primary' && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

        collector.on('collect', async i => {
            const kissEmbed = new MessageEmbed()
                .setColor('#b354ff')
                .setDescription(t('commands:kiss.success', { user: interaction.user.username, author: user.username }))
                .setImage(img2.url)
            await interaction.followUp({ embeds: [kissEmbed] });
            i.deferUpdate();
            return collector.stop();
        });
    }
}