const user = require('../../structures/databaseConnection');
const { MessageEmbed } = require('discord.js');
const { bglist } = require('../../json/backgroundList.json');

module.exports = {
    name: 'setbackground',
    aliases: ['setbg'],

    async run(client, message, args) {
        const userData = await user.findOne({ user: message.author.id });

        if (!userData) {
            message.foxyReply("Parece que você não está no meu banco de dados, execute o comando novamente!");
            return new user({
                user: message.author.id,
                coins: 0,
                lastDaily: null,
                reps: 0,
                lastRep: null,
                backgrounds: ['default.png'],
                background: 'default.png',
                aboutme: null,
                marry: null,
                premium: false,
            }).save().catch(err => console.log(err));
        }

        const bgCode = args[0];
        if (!bgCode) return message.foxyReply('Você precisa informar o código do seu background!');

        if (bgCode === 'list') {
            const bgs = userData.backgrounds;
            const bgList = bgs.join('\n');
            const embed = new MessageEmbed()
                .setTitle('Lista de backgrounds')
                .setDescription(bgList)
                .setFooter("Coloque o nome do arquivo do seu background")

            return message.foxyReply(embed);
            
        } else {

            const background = await bglist.find((index) => index.filename == args[0]?.toLowerCase());
            if (!background) return message.foxyReply('Este código não existe!');
            const backgroundList = userData.backgrounds;
            if (backgroundList.includes(bgCode)) {
                userData.background = bgCode;
                userData.save().catch(err => console.log(err));
                message.foxyReply(`Seu background foi alterado para ${bgCode}`);
            } else {
                message.foxyReply('Você não possui esse background!');
            }
        }
    }
}