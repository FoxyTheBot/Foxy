const { MessageEmbed } = require('discord.js');
const { bglist } = require('../../json/backgroundList.json');

module.exports = {
    name: 'setbackground',
    aliases: ['setbg'],

    async run(client, message, args) {
        const userData = await client.db.getDocument(message.author.id);

        const bgCode = args[0];
        if (!bgCode) return message.reply('Você precisa informar o código do seu background! Use o código list para listar os seus backgrounds');

        if (bgCode === 'list') {
            const bgs = userData.backgrounds;
            const bgList = bgs.join('\n');
            const embed = new MessageEmbed()
                .setTitle('Lista de backgrounds')
                .setDescription(bgList)
                .setFooter("Coloque o código do seu background")
            return message.reply(embed);
            
        } else {
            const background = await bglist.find((index) => index.id == args[0]?.toLowerCase());
            if (!background) return message.reply('Este código não existe!');
            const backgroundList = userData.backgrounds;
            if (backgroundList.includes(bgCode)) {
                userData.background = bgCode;
                userData.save().catch(err => console.log(err));
                message.reply(`Seu background foi alterado para ${bgCode}`);
            } else {
                message.reply('Você não possui esse background!');
            }
        }
    }
}