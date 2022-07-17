import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default class MarryCommand extends Command {
    constructor(client) {
        super(client, {
            name: "marry",
            description: "Marry with love of your life",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("marry")
                .setDescription("[Social] Marry with love of your life")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("The user to marry"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = await interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        if (user === this.client.user) return interaction.reply(t('commands:marry.bot'));
        if (user === interaction.user) return interaction.reply(t("commands:marry.self"));
        const authorData = await this.client.database.getUser(interaction.user.id);
        const userData = await this.client.database.getUser(user.id);
        if (userData.marriedWith) return interaction.reply(t("commands:marry.alreadyMarriedWithSomeone"));
        if (authorData.marriedWith) return interaction.reply(t("commands:marry.alreadyMarried", { user: user.username }));
        if (user === this.client.user) return interaction.reply(t('commands:marry.bot'));
        if (user.id === authorData.marriedWith) return interaction.reply(t('commands:marry.alreadyMarriedWithUser', { user: user.username }));


        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("accept")
                    .setLabel(t("commands:marry.accept"))
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("💓")
            )
        interaction.reply({ content: `${this.client.emotes.heart} | ${t('commands:marry.ask', { user: user.username, author: interaction.user.username })}`, components: [row] });

        const filter = i => i.customId === "accept" && i.user.id === user.id && i.message.id === interaction.message.id;
        const collector = await interaction.channel.createMessageComponentCollector(filter, { max: 1, time: 5000 });

        collector.on("collect", async i => {
            if (i.customId === 'accept') {
                if (await this.client.ctx.getContext(interaction, i, 2, user)) {
                    interaction.followUp(t('commands:marry.accepted', { user: user.username, author: interaction.user.username }));
                    i.deferUpdate();
                    userData.marriedWith = interaction.user.id;
                    userData.marriedDate = new Date();
                    authorData.marriedWith = user.id;
                    authorData.marriedDate = new Date();
                    await userData.save();
                    await authorData.save();
                    return collector.stop();
                } else {
                    i.deferUpdate();
                }
            }
        });
    }
}