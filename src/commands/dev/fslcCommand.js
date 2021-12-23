const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'fslc',
    aliases: ['fslc'],
    onlyDevs: true,

    async run(client, message, args) {
        const functionName = args[0];
        const userID = args[1];
        var value = args[2];

        if (!userID) {
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
                .setFooter("Use: f!fslc <função> <id> <valor> | por exemplo: f!fslc removecoins 687867247116812378 1337");
                
            return message.reply(embed);
        }

        const userData = await client.db.getDocument(userID);
        if (!userData) return message.reply("Usuário não encontrado");

        switch (functionName) {
            case 'addbg': {
                if (!value) return message.reply("Insira um arquivo de background!");
                userData.background = args[2];
                userData.backgrounds.push = args[2];
                userData.save();
                message.reply("Background adicionado");
                break;
            };

            case 'addcoins': {
                if (!value) return message.reply("Insira um valor");
                if (isNaN(value)) return message.reply("Você precisa digitar um número válido!");
                userData.balance += value;
                userData.save();
                message.reply(`${value} coins adicionados!`);
                break;
            };

            case 'removecoins': {
                if (!value) return message.reply("Insira um valor");
                if (isNaN(value)) return message.reply("Você precisa digitar um número válido!");
                userData.balance -= value;
                userData.save();
                message.reply(`${value} coins removidos!`);
                break;
            };
        }
    }
}