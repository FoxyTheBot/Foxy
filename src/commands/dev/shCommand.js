const Discord = require('discord.js');
const { exec } = require('shelljs');

module.exports = {
    name: "sh",
    aliases: ['shell', 'shell32'],
    ownerOnly: true,
    guildOnly: true,
    async run(client, message, args) {
        const commandBlock = args.join(' ');

        exec(commandBlock, (error, stdout, stderr) => {
            if (error) {
                const errorMessageEmbed = new Discord.MessageEmbed()
                    .setColor('#FF5555')
                    .setTitle(':x: ┃ Comando executado porém ele retornou um erro!')
                    .setDescription(`Comando Executado: \`\`\`x1\n${commandBlock}\n\`\`\` \n Valor Retornado: \`\`\`\n${stderr}\n\`\`\``)
                    .setFooter('Verifique o console para mais informações sobre o erro. | Digite f!help para obter ajuda.');
                return message.foxyReply(errorMessageEmbed);
            }
            const returnMessageEmbed = new Discord.MessageEmbed()
                .setColor('#5555DD')
                .setTitle(':tools: ┃ Comando executado sem retornar erros!')
                .setDescription(`Comando Executado: \`\`\`x1\n${commandBlock}\n\`\`\` \n Valor Retornado: \`\`\`\n${stdout}\n\`\`\``)
                .setFooter('Digite f!help para obter ajuda.');
            return message.foxyReply(returnMessageEmbed);
        })
    }
}