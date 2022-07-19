import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class BiteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "bite",
            description: "Bite someone",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("bite")
                .setDescription("[Roleplay] Bite someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to bite"))
        });
    }

    async execute(ctx, t): Promise<void> {
        const user = ctx.options.getUser("user");
        if (!user) return ctx.reply(t('commands:global.noUser'));

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("bite")
                    .setLabel(t('commands:bite.button'))
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("<:heheheheh:985197497968373810>")
            )

        if (user === ctx.user) return ctx.reply(t("commands:bite.self"));
        if (user === this.client.user) return ctx.reply(t("commands:bite.client"));

        const list = [
            'https://media1.tenor.com/images/f3f503705c36781b7f63c6d60c95a9d2/tenor.gif?itemid=17570122',
            'https://media1.tenor.com/images/6b42070f19e228d7a4ed76d4b35672cd/tenor.gif?itemid=9051585',
            'https://media1.tenor.com/images/83271613ed73fd70f6c513995d7d6cfa/tenor.gif?itemid=4915753',
            'https://i.pinimg.com/originals/4e/18/f4/4e18f45784b6b74598c56db4c8d10b4f.gif',

        ];

        const rand = list[Math.floor(Math.random() * list.length)];

        const embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(t('commands:bite.success', { user: ctx.user.username, target: user.username }))
            .setImage(rand)

        await ctx.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === "bite" && i.user.id === user.id && i.message.id === ctx.message.id;
        const collector = ctx.channel.createMessageComponentCollector({ filter, max: 1, time: 30000 });

        collector.on("collect", async i => {
            if (i.customId === "bite") {
                if (await ctx.getContext(i, 2, user)) {
                    const embed = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setDescription(t("commands:bite.success", { user: user.username, target: ctx.user.username }))
                        .setImage(rand)
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