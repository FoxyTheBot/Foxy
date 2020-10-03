const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
	let vote = new Discord.MessageEmbed()
	.setColor('RANDOM')
	.setTitle('Vote em mim :3')
	.setURL('https://discordbotlist.com/bots/foxy/upvote')
	.setDescription('Clique no link a cima para ser redirecionado')
	await message.channel.send(vote)
}