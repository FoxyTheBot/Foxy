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
                { name: ""}
            )

    }

    getCategory(category) {
        return this.client.commands.filter(c => c.config.category === category).map(c =>  `\`${c.config.name}\``).join(", ");
    }

    getSize(category) {
        return this.client.commands.filter(c => c.config.category === category).size;
    }
}