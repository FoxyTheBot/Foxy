import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";

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
        const mentionedUser = await interaction.options.getUser("user");
        if (!mentionedUser) return interaction.reply(t('commands:global.noUser'));

        if (mentionedUser === this.client.user) return interaction.reply(t('commands:marry.bot'));
        if (mentionedUser === interaction.user) return interaction.reply(t("commands:marry.self"));
        const authorData = await this.client.database.getUserByID(interaction.user.id);
        if (authorData.marriedWith) return interaction.reply(t("commands:marry.alreadyMarried", { user: mentionedUser.username }));
        if (mentionedUser === this.client.user) return interaction.reply(t('commands:marry.bot'));
        if (mentionedUser.id === authorData.marriedWith) return interaction.reply(t('commands:marry.alreadyMarriedWithUser', { user: mentionedUser.username }));

        const userData = await this.client.database.getUserByID(mentionedUser.id);
        if (userData.marriedWith) return interaction.reply(t("commands:marry.alreadyMarriedWithSomeone"));

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept")
                    .setLabel(t("commands:marry.accept"))
                    .setStyle("SUCCESS")
                    .setEmoji("💓")
            )
        interaction.reply({ content: `${this.client.emotes.heart} | ${t('commands:marry.ask', { user: mentionedUser.username, author: interaction.user.username })}`, components: [row] });

        const filter = i => i.customId === "accept" && i.user.id === mentionedUser.id;
        const collector = await interaction.channel.createMessageComponentCollector(filter, { max: 1, time: 15000 });

        collector.on("collect", async i => {
            if (i.customId === 'accept') {
                interaction.followUp(t('commands:marry.accepted', { user: mentionedUser.username, author: interaction.user.username }));
                i.deferUpdate();
                userData.marriedWith = interaction.user.id;
                userData.marriedDate = new Date();
                authorData.marriedWith = mentionedUser.id;
                authorData.marriedDate = new Date();
                await userData.save();
                await authorData.save();
                return collector.stop();
            }
        });
    }
}