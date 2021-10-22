const { SlashCommandBuilder } = require('@discordjs/builders');
const user = require('../../utils/DatabaseConnection');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbackground')
        .setDescription("Define um background que você já possui")
        .addStringOption(option =>
            option.setName("arquivo")
                .setDescription("Digite o nome do arquivo do background, para ver a lista digite list")
                .setRequired(true)),

    async execute(client, interaction) {
        const userData = await user.findOne({ user: interaction.member.id });
        const bgArchive = interaction.options.getString("arquivo");

        interaction.deferReply();
        
        if (!userData) {
            interaction.reply({ content: "Você não está no meu banco de dados, execute o comando novamente", ephemeral: true });
            return new user({
                user: message.author.id,
                coins: 0,
                lastDaily: null,
                reps: 0,
                lastRep: null,
                backgrounds: ['default.png'],
                background: 'default.png',
                aboutme: null,
                marry: null,
                premium: false,
            }).save().catch(err => console.log(err));
        }
        if (bgArchive == "list") {
            const bgs = await userData.backgrounds;
            const bgList = bgs.join('\n');
            const embed = new MessageEmbed()
                .setTitle("Lista de backgrounds")
                .setDescription(bgList)
                .setColor("#00ff00")
                .setFooter("Use o comando novamente com o nome do arquivo que você deseja");

            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const backgrounds = await bglist.find((index) => index.filename == bgArchive?.toLowerCase());
            if (!backgrounds) return interaction.reply({ content: "Arquivo não encontrado", ephemeral: true });
            const backgroundList = await userData.backgrounds;
            if (backgroundList.includes(bgArchive)) {
                userData.background = bgArchive;
                userData.save();
                interaction.reply({ content: `Seu background foi alterado para ${bgCode}`, ephemeral: true });
            } else {
                interaction.reply({ content: "Você não possui esse background", ephemeral: true });
            }
        }
    }
}
