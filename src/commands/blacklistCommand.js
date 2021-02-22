const users = require('../models/user');
module.exports = {
    name: "blacklist",
    aliases: ['blacklist', 'foxyban', 'fxyban'],
    guildOnly: true,
    ownerOnly: true,


    async execute(client, message ,args) {

        switch (args[0]) {

            case "add":
                const userID = args[1];
                if(!userID) return message.reply('usuário não encontrado, tente informar o ID da próxima vez.')
                users.findOne({ userid: userID }, function(error, data) {
                    if(error) return console.error(error);
                    if(data) {
                        user.userBanned = true
                        data.save()
                        message.channel.send("usuário banido!")
                    }
                })
                break

            case "remove":
                users.findOne({ userid: userID }, function(error, data) {
                    if(error) return console.error(error);
                    if(data) {
                        user.userBanned = true
                        data.save()
                        message.channel.send("usuário desbanido!")

                    }
                })
                break
            default:
                message.channel.send("Digite add ou remove!")

        }
    }
}