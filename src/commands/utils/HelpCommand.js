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
                .addSubcommand(subcommand => subcommand.setName("commands").setDescription("Mostra a lista de comandos"))
                .addSubcommand(subcommand => subcommand.setName("bot").setDescription("Mostra a ajuda sobre o bot"))
        })
    }

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "commands") {
            const embed = new MessageEmbed()
                .setTitle(`🎮 | Meus comandos (${this.client.commands.size})`)
                .addFields(
                    { name: `${this.client.emotes.daily} Economia (${this.getSize("economy")})`, value: this.getCategory("economy"), inline: true },
                    { name: `<:DiscordStaff:731947814246154240> Social (${this.getSize("social")})`, value: this.getCategory("social"), inline: true },
                    { name: `<:DiscordBoost:723225840548184195> Ações (${this.getSize("actions")})`, value: this.getCategory("actions"), inline: true },
                    { name: `<a:a_bongocat:768500700551315487> Imagens (${this.getSize("image")})`, value: this.getCategory("image"), inline: true },
                    { name: `⛏ Minecraft (${this.getSize("mine")})`, value: this.getCategory("mine"), inline: true },
                    { name: `<:cute_yay:901111399328124928> Entretenimento (${this.getSize("entertainment")})`, value: this.getCategory("entertainment"), inline: true },
                    { name: `<:DiscordStaff:731947814246154240> Utilitários (${this.getSize("utils")})`, value: this.getCategory("utils"), inline: true },
                )
                .setFooter("Alguns comandos podem não aparecer por serem sub comandos")
            await interaction.reply({ embeds: [embed] });
        } else if (subcommand === "bot") {
            const embed = new MessageEmbed()
                .setColor('7289da')
                .setTitle('<:info:718944993741373511> | __Ajuda__')
                .setDescription(`Olá ${interaction.user.username}! Eu sou a Foxy, tenho recursos para entreter e envolver seus membros, recursos de moderação para manter seu servidor seguro \n **Tornar seu servidor único e extraordinário nunca foi tão fácil!**`)
                .setThumbnail('https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024')
                .addField('<:DiscordStaff:731947814246154240> Lista de comandos:', 'Digite /help commands')
                .addField(`${this.client.emotes.dev} Está com dúvidas? Meu servidor de suporte`, 'https://discord.gg/W6XtYyqKkg')
                .addField('<:info:718944993741373511> Termos de uso', 'https://foxywebsite.ml/tos.html')
                .addField('<:ApoiadorDoDiscord:731946134720741377> Meu Website onde você pode me adicionar', 'https://foxywebsite.ml/');

            await interaction.reply({ embeds: [embed] });
        }
    }

    getCategory(category) {
        return this.client.commands.filter(c => c.config.category === category).map(c => `\`${c.config.name}\``).join(", ");
    }

    getSize(category) {
        return this.client.commands.filter(c => c.config.category === category).size;
    }
}
