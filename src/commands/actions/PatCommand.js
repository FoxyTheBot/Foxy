const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const neko = new (require("nekos.life"));

module.exports = class PatCommand extends Command {
    constructor(client) {
        super(client, {
            name: "pat",
            description: "Faça cafuné em alguém",
            category: "actions",
            data: new SlashCommandBuilder()
                .setName("pat")
                .setDescription("Faça cafuné em alguém")
                .addUserOption(option => option.setName("user").setRequired(true).setDescription("O usuário que você quer pat"))
        })
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const gif = await neko.sfw.pat();
        const gif2 = await neko.sfw.pat();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Retribuir")
                    .setCustomId("pat")
                    .setStyle("PRIMARY")
            )

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`${interaction.user} fez cafuné em ${user}`)
            .setImage(gif.url)

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId == "pat" && i.user.id == user.id;
        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 60000, max: 1 });

        collector.on("collect", async i => {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`${user} retribuiu ${interaction.user}`)
                .setImage(gif2.url)
            i.deferUpdate();
            await interaction.followUp({ embeds: [embed] });
        })
    }
}