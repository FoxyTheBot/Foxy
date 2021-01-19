
module.exports = { 
    name: "id",
    aliases: ['id', 'userid'],
    cooldown: 5,
guildOnly: false,
    async execute(client, message, args) {
    


    message.channel.send(`Sua id é: ${message.author.id}`)

}

}