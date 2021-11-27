const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const neko = new (require("nekos.life"));

module.exports = class HugCommand extends Command {
    constructor(client) {
        super(client, {
            name: "hug",
            description: "Abraçar alguém",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("hug")
                .setDescription("Abraçar alguém")
                .addUserOption(option => option.setName("user").setDescription("Mencione um usuário").setRequired(true))
        })
    }

    async execute(interaction) {
        const user = await interaction.options.getUser("user");

        const img = await neko.sfw.hug();
        const img2 = await neko.sfw.hug();

        const hugEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`${interaction.user} abraçou ${user}`)
            .setImage(img.url)
            
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("primary")
                    .setLabel("💞 Retribuir")
                    .setStyle("PRIMARY")
            )

        await interaction.reply({ embeds: [hugEmbed], components: [row] });

        const filter = i => i.customId === 'primary' && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000, max: 1 });

        collector.on('collect', async i => {
            const hugEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`${user} abraçou ${interaction.user}`)
                .setImage(img2.url)
            await interaction.followUp({ embeds: [hugEmbed] });
            i.deferUpdate();
        });
    }
}