import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

export default class AttachCommand extends Command {
    constructor(client) {
        super(client, {
            name: "attack",
            description: "Attack someone",
            category: "actions",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("attack")
                .setDescription("[🎮 Roleplay] Attack someone")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("User you want to attack"))
        });
    }

    async execute(interaction, t): Promise<void> {
        const user = await interaction.options.getUser('user');
        if (!user) return interaction.reply(t('commands:global.noUser'));

        const list = [
            'https://cdn.zerotwo.dev/PUNCH/38a3ab62-17f4-4682-873a-121e886d7bce.gif',
            'https://cdn.zerotwo.dev/PUNCH/84c082d0-24e7-491e-bcfc-be03ee46125c.gif',
            'https://cdn.zerotwo.dev/PUNCH/3a5b2598-a973-4e6f-a1d0-9b87a2c35a18.gif',
        ]

        const rand = list[Math.floor(Math.random() * list.length)];
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel(t('commands:attack.button'))
                    .setEmoji("928710998964174949")
                    .setCustomId("attack")
                    .setStyle("PRIMARY")
            )

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(t('commands:attack.attack', { user: interaction.user.username, target: user.username }))
            .setImage(rand)

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customid === "attack" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 60000, max: 1 });

        collector.on("collect", async i => {
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(t('commands:attack.description', { user: user.username, target: interaction.user.username }))
                .setImage(rand)
            await interaction.followUp({ embeds: [embed] });
            i.deferUpdate();
            return collector.stop();
        })
    }
}