const Discord = require('discord.js');
const userModel = require('../../structures/DatabaseConnection');
module.exports = {
    name: 'afkCommand',
    aliases: ['afk'],
    cooldown: 5,
    guildOnly: true,
    async run(client, message, args) {
        let afkreason = args.join(' ');
        if (message.content.includes("@")) {
            return message.reply(`${client.emotes.denied} **|** Você não pode mencionar usuários ou cargos!`)
        }
        if (!afkreason) afkreason = "O motivo do \`AFK\` não foi informado.";
        userModel.findOne({ userid: message.author.id }, function (error, document) {
            if (error) return console.error(error);
            if (document) {
                document.afk = true
                document.afkR = afkreason
                document.save().then(() => {
                    message.reply(`${client.emotes.error} | O modo AFK foi ativado com o motivo \`${afkreason}\``);
                });
            } else {
                message.channel.send(`<:Ping:791665866714513421>| Parece que você não tinha um perfil no banco de dados, seu perfil está sendo criado! ${client.emotes.success}`);
                new userModel({
                    userid: message.author.id,
                    username: message.author.username,
                    userBanned: false,
                    premium: false,
                    afk: false,
                    afkR: "not"
                }).save().then(() => {
                    setTimeout(() => {
                        message.channel.send(`${client.emotes.success} **|** Seu perfil foi criado, seu AFK está sendo ativado! ${client.emotes.afk}`);
                    }, 2000)
                }).catch((error) => {
                    console.log(error);
                    message.channel.send(`${client.emotes.error} **|** Ocorreu um erro ao executar este comando, desculpe a inconveniência!`);
                });
                document.afk = true
                document.afkR = afkreason
                document.save().then(() => {
                    setTimeout(() => {
                        message.channel.send(`<:meow_thumbsup:768292477555572736>| O modo AFK foi ativado com o motivo \`${afkreason}\``)
                    }, 1000)
                }).catch((error) => {
                    console.log(error);
                })
            }
        })
    }
}