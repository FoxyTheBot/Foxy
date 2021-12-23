const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../../structures/Command");

module.exports = class BiteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "bite",
            category: "actions",
            data: new SlashCommandBuilder()
                .setName("bite")
                .setDescription("[👏 Roleplay] Morde alguém")
                .addUserOption(option => option.setName("user").setDescription("O usuário que você deseja morder").setRequired(true))
        });
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("bite")
                    .setLabel("Retribuir")
                    .setStyle("DANGER")
            )

        if (user === interaction.user) return interaction.reply(`${interaction.user} mordeu a si mesmo agora está machucado`);
        if (user === this.client.user) return interaction.reply(`${interaction.user} tentou me morder e ganhou uma marca de mordida no braço 😘`)

        const list = [
            'https://media1.tenor.com/images/f3f503705c36781b7f63c6d60c95a9d2/tenor.gif?itemid=17570122',
            'https://media1.tenor.com/images/6b42070f19e228d7a4ed76d4b35672cd/tenor.gif?itemid=9051585',
            'https://media1.tenor.com/images/83271613ed73fd70f6c513995d7d6cfa/tenor.gif?itemid=4915753',
            'https://i.pinimg.com/originals/4e/18/f4/4e18f45784b6b74598c56db4c8d10b4f.gif',

        ];

        const rand = list[Math.floor(Math.random() * list.length)];

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Nhau")
            .setDescription(`${interaction.user} **mordeu** ${user}`)
            .setImage(rand)

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === "bite" && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 30000 });

        collector.on("collect", async i => {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle("Nhau")
                .setDescription(`${user} devolveu a mordida de ${interaction.user}`)
                .setImage(rand)
                i.deferUpdate();
            await interaction.followUp({ embeds: [embed] });
        })
    }
}