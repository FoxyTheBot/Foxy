const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class AttackCommand extends Command {
    constructor(client) {
        super(client, {
            name: "attack",
            category: "actions",
            data: new SlashCommandBuilder()
                .setName("attack")
                .setDescription("[👏 Roleplay] Ataque alguém")
                .addUserOption(option => option.setName("user").setDescription("O usuário que você deseja atacar").setRequired(true))
        });
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const list = [
            'https://cdn.zerotwo.dev/PUNCH/38a3ab62-17f4-4682-873a-121e886d7bce.gif',
            'https://cdn.zerotwo.dev/PUNCH/84c082d0-24e7-491e-bcfc-be03ee46125c.gif',
            'https://cdn.zerotwo.dev/PUNCH/3a5b2598-a973-4e6f-a1d0-9b87a2c35a18.gif',
        ]

        const rand = list[Math.floor(Math.random() * list.length)];
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Atacar")
                    .setEmoji("928710998964174949")
                    .setCustomId("attack")
                    .setStyle("PRIMARY")
            )

        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(`${interaction.user} atacou ${user}`)
            .setImage(rand)

        await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = i => i.customid === "attack" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 60000, max: 1 });

        collector.on("collect", async i => {
            const embed = new MessageEmbed()
                .setColor('#ff0000')
                .setDescription(`${user} atacou ${interaction.user}`)
                .setImage(rand)
                i.deferUpdate();
            await interaction.followUp({ embeds: [embed] });
        })
    }
}