module.exports = {
name: "ticket",
aliases: ['ticket'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {
	if (!message.guild.me.hasPermission('MANAGE_CHANNELS'))
		return message.channel.send('Não tenho permissão de gerenciar canais');
	if (
		message.guild.channels.cache.find(ch => ch.name.includes(message.author.id))
	)
		return message.reply('Já existe um canal criado pra você');

	let channel; // declarando variavel global channel que é o canal que vai ser criado e marcado a pessoa que deu comando
	try {
		// ← Tentar criar o canal, se nao conseguir cai no catch
		channel = await message.guild.channels.create(
			`${message.member.displayName}•${message.author.discriminator}┋${
				message.author.id
			}`,
			{
				permissionOverwrites: [
					{
						id: message.guild.id, // permissoes para cargo @everyone (todo mundo)
						deny: ['VIEW_CHANNEL'] // permissoes de nao ver o canal (ler mensagens)
					},
					{
						id: message.author.id, // permissoes para quem digitou o comando
						allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] // essa pessoa pode ver o canal e enviar mensagens
					}
				]
			}
		);
	} catch (err) {
		message.channel.send('Erro: ' + err.message);
	}

	let timeout = await channel
		.send(`<@${message.author.id}>`) // espera o canal ser criado e marca o membro
		.catch(err => message.channel.send('Erro: ' + err.message));
	timeout.delete({ timeout: 2000 }); // deleta a mensagem que ping que avisou o membro do canal criado
	setTimeout(
		() =>
			channel
				.delete()
				.then(c => message.channel.send(`\`Canal ${c.name} deletado ✅\``)) // avisa no canal que foi dado o comando que o canal foi deletado
				.catch(err => message.channel.send('Erro: ' + err.message)),
		5000 * 60
	);
}

}