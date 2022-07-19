import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import NekosLife from "nekos.life";

export default class PatCommand extends Command {
    constructor(client) {
        super(client, {
            name: "pat",
            description: "Pats someone",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("pat")
                .setDescription("[Roleplay] Pat someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to pat"))
        });
    }

    async execute(ctx, t): Promise<void> {
        const neko = new NekosLife();

        const user = ctx.options.getUser("user");
        if (!user) return ctx.reply(t('commands:global.noUser'));

        const gif = await neko.pat();
        const gif2 = await neko.pat();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(t('commands:pat.button'))
                    .setCustomId("pat")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("<:heheheheh:985197497968373810>")
            )

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setDescription(t('commands:pat.success', { user: user.username, author: ctx.user.username }))
            .setImage(gif.url)

        await ctx.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId == "pat" && i.user.id == user.id && i.message.id === ctx.message.id;
        const collector = ctx.channel.createMessageComponentCollector(filter, { time: 15000, max: 1 });

        collector.on("collect", async i => {
            if (i.customId == "pat") {
                if (await ctx.getContext(i, 2, user)) {
                    const embed = new EmbedBuilder()
                        .setColor("#57F287")
                        .setDescription(t('commands:pat.success', { user: ctx.user.username, author: user.username }))
                        .setImage(gif2.url)
                    await ctx.followUp({ embeds: [embed] });
                    i.deferUpdate();
                    return collector.stop();
                } else {
                    i.deferUpdate();
                }
            }
        })
    }
}