const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { bglist } = require('../../structures/backgroundList.json');

module.exports = class SetBackgroundCommand extends Command {
    constructor(client) {
        super(client, {
            name: "setbackground",
            category: "economy",
            data: new SlashCommandBuilder()
                .setName("setbackground")
                .setDescription("Define o fundo do seu perfil.")
                .addStringOption(option => option.setName("background").setDescription("Define o fundo do seu perfil.").setRequired(true))
        })
    }

    async execute(interaction) {
        const string = interaction.options.getString("background");
        const userData = await this.client.database.getDocument(interaction.user.id)

        if (string === "list") {
            const bgs = userData.backgrounds;
            const bgList = bgs.join('\n');
            const embed = new MessageEmbed()
                .setTitle('Lista de backgrounds')
                .setDescription(bgList)
                .setFooter("Coloque o nome do arquivo do seu background")

            await interaction.reply({ embeds: [embed] });
        } else {
            const background = await bglist.find((index) => index.id === string?.toLowerCase());
            if (!background) return await interaction.reply("Background não encontrado");
            const backgroundList = userData.backgrounds;
            if (backgroundList.includes(string)) {
                userData.background = string;
                userData.save();
                await interaction.reply("Background alterado com sucesso");
            } else {
                await interaction.reply("Você não tem esse background");
            }
        }
    }
}