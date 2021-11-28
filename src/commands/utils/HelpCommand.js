const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Command = require("../../structures/Command");

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Mostra o menu de ajuda",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("help")
                .setDescription("Mostra o menu de ajuda")
        })
    }

    async execute(interaction) {
        const embed = new MessageEmbed()
            .setTitle("Menu de ajuda")
            .setDescription("Aqui estão todos os comandos disponíveis para você usar")
            .addFields(
                { name: `💵 Economia (${this.getSize("economy")})`, value: this.getCategory("economy"), inline: true },
                { name: `🗣 Social (${this.getSize("social")})`, value: this.getCategory("social"), inline: true },
                { name: `💥 Ações (${this.getSize("actions")})`, value: this.getCategory("actions"), inline: true },
                { name: `🖼 Imagens (${this.getSize("images")})`, value: this.getCategory("images"), inline: true },
                { name: `🛡 Moderação (${this.getSize("mod")})`, value: this.getCategory("mod"), inline: true },
                { name: `⛏ Minecraft (${this.getSize("mod")})`, value: this.getCategory("mod"), inline: true },
                { name: `<:cute_yay:901111399328124928> Entretenimento (${this.getSize("entretainment")})`, value: this.getCategory("entretainment"), inline: true },
                { name: `🔧 Utilitários (${this.getSize("utils")})`, value: this.getCategory("utils"), inline: true },
            )

            await interaction.reply({ embeds: [embed] });

    }

    getCategory(category) {
        return this.client.commands.filter(c => c.config.category === category).map(c =>  `\`${c.config.name}\``).join(", ");
    }

    getSize(category) {
        return this.client.commands.filter(c => c.config.category === category).size;
    }
}