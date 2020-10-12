<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
	let vote = new Discord.MessageEmbed()
	.setColor('RANDOM')
	.setTitle('Vote em mim :3')
	.setURL('https://discordbotlist.com/bots/foxy/upvote')
	.setDescription('Clique no link a cima para ser redirecionado')
	await message.channel.send(vote)
<<<<<<< HEAD
=======
=======
const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
	let vote = new Discord.MessageEmbed()
	.setColor('RANDOM')
	.setTitle('Vote em mim :3')
	.setURL('https://discordbotlist.com/bots/foxy/upvote')
	.setDescription('Clique no link a cima para ser redirecionado')
	await message.channel.send(vote)
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
>>>>>>> 29acc2112f1f1b022c2e185e1f27f7123ef33f38
}