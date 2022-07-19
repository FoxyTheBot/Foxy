import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class DivorceCommand extends Command {
    constructor(client) {
        super(client, {
            name: "divorce",
            description: "Divorce your partner",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("divorce")
                .setDescription("[Social] Divorce your partner")
        });
    }

    async execute(ctx, t): Promise<void> {
        const userData = await this.client.database.getUser(ctx.user.id);
        const marriedId = await userData.marriedWith;

        if (!marriedId) return ctx.reply(t("commands:divorce.notMarried"));

        const userInfo = await this.client.users.fetch(marriedId);
        const marriedData = await this.client.database.getUser(marriedId);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("divorce")
                    .setLabel(t("commands:divorce.confirm"))
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("💔")
            )

        ctx.reply({ content: t('commands:divorce.confirm2', { user: userInfo.username }), components: [row], flags: 64 });

        const filter = i => i.customId === "divorce" && i.user.id === ctx.user.id && i.message.id === ctx.message.id;
        const collector = await ctx.channel.createMessageComponentCollector(filter, { max: 1, time: 5000 });

        collector.on("collect", async i => {
            if (i.customId === 'divorce') {
                if (await ctx.getContext(ctx, i, 1)) {
                    ctx.followUp({ content: `:broken_heart: **|** ${t('commands:divorce.divorced')}`, flags: 64 });
                    i.deferUpdate();
                    userData.marriedWith = null;
                    userData.marriedDate = null;
                    marriedData.marriedWith = null;
                    marriedData.marriedDate = null;
                    await userData.save();
                    await marriedData.save();
                    return collector.stop();
                }
            } else {
                i.deferUpdate();
            }
        });
    }
}