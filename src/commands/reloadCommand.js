module.exports = {
	name: 'reload',
	aliases: ['r', 'reload'],
	ownerOnly: false,
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
			message.channel.send(`<:DiscordUpdate:790934280724414465> **|** Comando \`${command.name}\` foi atualizado`);
		} catch (error) {
			console.error(error);
			message.channel.send(`<:Error:718944903886930013> **|** Ocorreu um erro ao atualizar o comando: \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};