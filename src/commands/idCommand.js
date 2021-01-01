const Discord = require ('discord.js')

module.exports.run = async (client ,message) => {
    


    message.channel.send(`Sua id é: ${message.author.id}`)

}

module.exports.help = {
    name: "id",
	aliases: ["id"]
}