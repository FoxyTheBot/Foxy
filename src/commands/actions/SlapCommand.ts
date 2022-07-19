import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import NekosLife from "nekos.life";

export default class SlapCommand extends Command {
    constructor(client) {
        super(client, {
            name: "slap",
            description: "Slaps someone",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("slap")
                .setDescription("[Roleplay] Slaps someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to slap"))
        });
    }

    async execute(ctx, t): Promise<void> {
        const user = ctx.options.getUser("user");
        if (!user) return ctx.reply(t('commands:global.noUser'));

        const neko = new NekosLife();

        const slap = await neko.slap();
        const slap2 = await neko.slap();
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(t('commands:slap.button'))
                    .setCustomId("slap")
                    .setStyle(ButtonStyle.Primary)
            )

        const embed = new EmbedBuilder()
            .setDescription(t('commands:slap.success', { user: user.username, author: ctx.user.username }))
            .setImage(slap.url)
        await ctx.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === "slap" && i.user.id === user.id && i.message.id === ctx.message.id;
        const collector = ctx.channel.createMessageComponentCollector(filter, { time: 15000, max: 1 });

        collector.on("collect", async i => {
            if (i.customId === "slap") {
                if (await ctx.getContext(i, 2, user)) {
                    const embed2 = new EmbedBuilder()
                        .setDescription(t('commands:slap.success', { user: ctx.user.username, author: user.username }))
                        .setImage(slap2.url)
                    await ctx.followUp({ embeds: [embed2] });
                    i.deferUpdate();
                    return collector.stop();
                } else {
                    i.deferUpdate();
                }
            }
        })
    }
}