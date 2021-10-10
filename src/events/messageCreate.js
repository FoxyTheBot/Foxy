const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = async (client, message) => {

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setURL("https://discord.com/oauth2/authorize?client_id=737044809650274325&scope=bot+applications.commands&permissions=269872255")
                .setLabel('Atualize minhas permissões')
                .setStyle('LINK'),
        );

    const messageError = new MessageEmbed();
    messageError.setColor("#ff0000");
    messageError.setTitle("Não é possível mais usar os comandos tradicionais da Foxy!");
    messageError.setDescription("Infelizmente por uma futura limitação do Discord em Abril de 2022, todos os bots irão parar de suportar os comandos tradicionais como: \n\n **Loritta: +ping** \n **OwOBot: owoping** \n **Zero Two: zt!ping** \n\n\n Peço para me adicionar novamente no seu servidor para atualizar minhas permissões, obrigada! :D");
    
    if (message.content.startsWith("f!")) {
        return message.reply({ embeds: [messageError], components: [row] });
    }
}