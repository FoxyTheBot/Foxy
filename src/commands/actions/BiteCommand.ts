import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

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

    async execute(interaction, t): Promise<void> {
        const user = interaction.options.getUser("user");
        if (!user) return interaction.reply(t('commands:global.noUser'));

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("bite")
                    .setLabel(t('commands:bite.button'))
                    .setStyle("DANGER")
            )

        if (user === interaction.user) return interaction.reply(t("commands:bite.self"));
        if (user === this.client.user) return interaction.reply(t("commands:bite.client"));

        const list = [
            'https://media1.tenor.com/images/f3f503705c36781b7f63c6d60c95a9d2/tenor.gif?itemid=17570122',
            'https://media1.tenor.com/images/6b42070f19e228d7a4ed76d4b35672cd/tenor.gif?itemid=9051585',
            'https://media1.tenor.com/images/83271613ed73fd70f6c513995d7d6cfa/tenor.gif?itemid=4915753',
            'https://i.pinimg.com/originals/4e/18/f4/4e18f45784b6b74598c56db4c8d10b4f.gif',

        ];

        const rand = list[Math.floor(Math.random() * list.length)];

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("rawr")
            .setDescription(t('commands:bite.success', { user: interaction.user.username, target: user.username }))
            .setImage(rand)

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === "bite" && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 30000 });

        collector.on("collect", async i => {
            if (i.customId === "bite") {
                const embed = new MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle("rawr")
                    .setDescription(t("commands:bite.success", { user: user.username, target: interaction.user.username }))
                    .setImage(rand)
                await interaction.followUp({ embeds: [embed] });
                i.deferUpdate();
                return collector.stop();
            }
        })
    }
}