const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const neko = new (require("nekos.life"));

module.exports = class KissCommand extends Command {
    constructor(client) {
        super(client, {
            name: "kiss",
            description: "Beijar alguém",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("kiss")
                .setDescription("Beijar alguém")
                .addUserOption(option => option.setName("user").setDescription("Mencione um usuário").setRequired(true))
        })
    }

    async execute(interaction) {
        const img = await neko.sfw.kiss();
        const img2 = await neko.sfw.kiss();
        const user = await interaction.options.getUser("user");

        if (user == this.client.user) return interaction.reply("🙅‍♀️ **|** Nah, eu não quero te beijar!");
        if (!user) return interaction.reply('lembre-se de mencionar um usuário válido para beijar!');

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("primary")
                    .setLabel("😘 Retribuir")
                    .setStyle("PRIMARY")
            )

        const embed = new MessageEmbed()
            .setColor('#000000')
            .setDescription(`${interaction.user} **beijou** ${user}`)
            .setImage(img.url)
            .setTimestamp();
        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'primary' && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            const kissEmbed = new MessageEmbed()
                .setColor('#000000')
                .setDescription(`${user} **Beijou** ${interaction.user}`)
                .setImage(img2.url)
            await interaction.followUp({ embeds: [kissEmbed] });
        });
    }
}