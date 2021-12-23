const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const neko = new (require("nekos.life"));

module.exports = class SlapCommand extends Command {
    constructor(client) {
        super(client, {
            name: "slap",
            category: "actions",
            data: new SlashCommandBuilder()
                .setName("slap")
                .setDescription("[👏 Roleplay] Bata em alguém")
                .addUserOption(option => option.setName("user").setDescription("O usuário que você deseja bater").setRequired(true))
        });
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        const slap = await neko.sfw.slap();
        const slap2 = await neko.sfw.slap();
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Retribuir")
                    .setCustomId("slap")
                    .setStyle("PRIMARY")
            )

        const embed = new MessageEmbed()
            .setDescription(`${interaction.user} **bateu** em ${user}`)
            .setImage(slap.url)
        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === "slap" && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 15000, max: 1 });

        collector.on("collect", async i => {
            const embed2 = new MessageEmbed()
                .setDescription(`${user} **bateu** em ${interaction.user}`)
                .setImage(slap2.url)

            await interaction.followUp({ embeds: [embed2] });
            i.deferUpdate();
        })
    }
}