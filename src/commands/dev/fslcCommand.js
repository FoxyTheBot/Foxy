const user = require('../../structures/databaseConnection');
const { MessageEmbed } = require('discord.js');
const { bglist } = require('../../json/backgroundList.json');
module.exports = {
    name: 'fslc',
    aliases: ['fslc'],
    onlyDevs: true,

    async run(client, message, args) {
        const userID = args[1];
        const functionName = args[0];
        var value = args[2];

        const embed = new MessageEmbed()
        .setTitle("Gerenciamento de banco de dados")
        .setDescription("Comandos disponíveis:")
        .addFields(
            { name: "addbg", value: "Adiciona um background" },
            { name: "adduser", value: "Adiciona um usuário" },
            { name: "setpremium", value: "Seta o estado de premium" },
            { name: "addcoins", value: "Adiciona coins" },
            { name: "removecoins", value: "Remove coins" }
        )
        .setFooter("Use: f!fslc <função> <id> <valor> | por exemplo: f!fslc setpremium 687867247116812378 true");
    
        if (!userID) return message.foxyReply(embed);
        const userData = await user.findOne({ user: userID });
        if (!userData) return message.foxyReply("Usuário não encontrado");

        switch (functionName) {

            case 'addbg': {
                if (!value) return message.foxyReply("Insira um arquivo de background!");
                userData.background = args[2];
                userData.backgrounds.push = args[2];
                userData.save();
                message.foxyReply("Background adicionado");
                break;
            };

            case 'addcoins': {
                if (!value) return message.foxyReply("Insira um valor");
                if (isNaN(value)) return message.foxyReply("Você precisa digitar um número válido!");
                userData.coins += value;
                userData.save();
                message.foxyReply(`${value} coins adicionados!`);
                break;
            };

            case 'removecoins': {
                if (!value) return message.foxyReply("Insira um valor");
                if (isNaN(value)) return message.foxyReply("Você precisa digitar um número válido!");
                userData.coins -= value;
                userData.save();
                message.foxyReply(`${value} coins removidos!`);
                break;
            };
        }
    }
}