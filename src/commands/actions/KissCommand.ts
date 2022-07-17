import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
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
                .setDescription("[Roleplay] Kiss someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to kiss"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const neko = new NekosLife();

        const img = await neko.kiss();
        const img2 = await neko.kiss();
        const user = await interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        if (user == this.client.user) return interaction.reply(t('commands:kiss.self'));

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("1")
                    .setLabel(t("commands:kiss.button"))
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("<:heartuwu:978732409170309240>")
            )

        const embed = new EmbedBuilder()
            .setColor('#06c5ef')
            .setDescription(t('commands:kiss.success', { user: user.username, author: interaction.user.username }))
            .setImage(img.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === '1' && i.user.id === user.id && i.message.id === interaction.message.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 15000, max: 1 });

        collector.on('collect', async i => {
            if (i.customId === '1') {
                if (await this.client.ctx.getContext(interaction, i, 2, user)) {
                    const kissEmbed = new EmbedBuilder()
                        .setColor('#b354ff')
                        .setDescription(t('commands:kiss.success', { user: interaction.user.username, author: user.username }))
                        .setImage(img2.url)
                    await interaction.followUp({ embeds: [kissEmbed] });
                    i.deferUpdate();
                    return collector.stop();
                }
            } else {
                i.deferUpdate();
            }
        });
    }
}