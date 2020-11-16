const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
	
	message.delete().catch(O_o => {});
	
	let vote = new Discord.MessageEmbed()
	.setColor('RANDOM')
	.setTitle('<a:pet_the_foxy:775566720425394188> Vote clicando aqui')
	.setURL('https://top.gg/bot/737044809650274325')
	.setDescription('<a:happy_shuffle:768500897483325493> Me ajude a crescer e me ajude a ser um bot melhor votando em mim no Discord Bot List! <:catblush:768292358458179595>\nCada voto ajuda a me divulgar para outras pessoas na Discord Bot List <:catblush:768292358458179595>\n\n Que tal você se juntar a todas as outras pessoas que votaram e que me ajudaram a crescer?')
	await message.channel.send(vote)
}