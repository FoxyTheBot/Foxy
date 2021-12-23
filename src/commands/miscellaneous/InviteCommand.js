const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = class InviteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "invite",
            description: "Mostra o link para convidar o bot.",
            category: "misc",
            data: new SlashCommandBuilder()
                .setName("invite")
                .setDescription("[🎉 Misc] Mostra o link para convidar o bot.")
        });
    }

    async execute(interaction) {
        const embed = new MessageEmbed()
            .setColor('#4cd8b2')
            .setDescription('Você quer me adicionar em outros servidores/guilds do Discord? \n Então [clique aqui](https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255) para me adicionar em outro servidor! \n Caso precise obter suporte entre no meu servidor de suporte [clicando aqui](https://discord.gg/W6XtYyqKkg) \n\n || A permissão é de administrador, mas eu acho que você confia em mim :D || ')

        await interaction.reply({ embeds: [embed] });
    }
}