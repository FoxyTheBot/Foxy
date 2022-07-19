import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
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

    async execute(ctx, t): Promise<void> {
        const neko = new NekosLife();
        const user = await ctx.options.getUser("user");
        if (!user) return ctx.reply(t('commands:global.noUser'));

        const img = await neko.hug();
        const img2 = await neko.hug();

        const hugEmbed = new EmbedBuilder()
            .setColor("#57F287")
            .setDescription(t('commands:hug.success', { user: user.username, author: ctx.user.username }))
            .setImage(img.url)

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("hug")
                    .setLabel(t("commands:hug.button"))
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("<:ztLove:978732042160332850>")
            )

        await ctx.reply({ embeds: [hugEmbed], components: [row] });

        const filter = i => i.customId === 'hug' && i.user.id === user.id && i.message.id === ctx.message.id;
        const collector = ctx.channel.createMessageComponentCollector(filter, { time: 15000, max: 1 });

        collector.on('collect', async i => {
            if (i.customId === 'hug') {
                if (await ctx.getContext(i, 2, user)) {
                    const hugEmbed = new EmbedBuilder()
                        .setColor("#57F287")
                        .setDescription(t('commands:hug.success', { user: ctx.user.username, author: user.username }))
                        .setImage(img2.url)
                    await ctx.followUp({ embeds: [hugEmbed] });
                    i.deferUpdate();
                    return collector.stop();
                }
            } else {
                i.deferUpdate();
            }
        });
    }
}