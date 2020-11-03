const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
	
	message.delete().catch(O_o => {});
	
	let vote = new Discord.MessageEmbed()
	.setColor('RANDOM')
	.setTitle('Vote em mim :3')
	.setURL('https://top.gg/bot/737044809650274325/vote')
	.setDescription('Clique no link a cima para ser redirecionado')
	await message.channel.send(vote)
}
