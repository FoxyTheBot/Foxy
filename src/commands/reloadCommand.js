module.exports = {
	name: 'reload',
	aliases: ['r', 'reload'],
	ownerOnly: true,
	execute(client, message, args) {

     
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) {
			return message.channel.send(`Não existe nenhum comando chamado \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`./${command.name}Command.js`)];

		try {
			const newCommand = require(`./${command.name}Command.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Comando \`${command.name}\` foi recarregado`);
		} catch (error) {
			console.error(error);
			message.channel.send(`Ocorreu um erro ao recarregar o comando: \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};