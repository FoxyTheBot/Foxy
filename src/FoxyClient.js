const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const user = require('./schema/user')
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


const cooldowns = new Discord.Collection();
client.on('ready', () => {
    const DBL = require("dblapi.js")
const Sentry = require('@sentry/node')
const { prefix, dbltoken } = require('./config.json')
   
    const dbl = new DBL(dbltoken, client)
    dbl.postStats(client.guilds.cache.size, client.shard.ids, client.shard.count)
    dbl.on("error", console.error) 

        console.log(`[CONNECTION SUCCESSFULLY] - Guilds ${client.guilds.cache.size}`)
        let status = [
            { name: `❓ Se você precisa de ajude use ${prefix}help`, type: "WATCHING" },
            { name: `💻 Quer encontrar meus comandos use: ${prefix}commands`, type: "PLAYING" },
            { name: "🐦 Me siga no Twitter: @FoxyDiscordBot", type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
            { name: `💖 Fui criada pelo WinG4merBR#5995`, type: "LISTENING" },
            { name: `😍 Me adicione usando ${prefix}invite`, type: "WATCHING" },
            { name: `✨ Entre no meu servidor de suporte usando ${prefix}help`, type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
            { name: `🐛 Se você encontrou um bug use ${prefix}report para reportar falhas`, type: "PLAYING" },
            { name: `🍰 Minha comida preferida é bolo 💖`, type: "WATCHING"}
        ]

        setInterval(() => {
            let randomStatus = status[Math.floor(Math.random() * status.length)]
           client.user.setPresence({ activity: randomStatus })
        }, 5000)
        Sentry.init({ dsn: process.env.SENTRY_DSN })
    }
)
client.on("message", message => {
    if ( message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>` ) message.channel.send(`Olá ${message.author} eu sou a Foxy! Meu prefixo é ${prefix}, use f!help para obter ajuda.`)

})


client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('🛑 **|** Este comando não pode ser executado em Mensagens Diretas!');
    }

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Por favor aguarde ${timeLeft.toFixed(1)} segundos para usar o comando \`${command.name}\` novamente`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
        if(message.webhookID) return;
        if(message.author.bot) return;
        if(message.channel.dm === 'dm') return;
        user.findOne({ userid: message.author.id}, function(erro, dados) {
            if(dados) {
                if(dados.userid == message.author.id) return;

                if(erro) return console.log(erro);

                new user ({
                    userBanned: 'not'
                })
                dados.save().catch((err) => {
                    console.log(err)
                })
            } else {
                new user({
                    userid: message.author.id,
                    username: message.author.username,
                    userBanned: 'not'
                }).save().catch((err) => {
                    console.log(err)
                })
            }
        })

        user.findOne({ userid: message.author.id}, function(error, dados) {
            if(dados) {
                if(error) return console.log(error);

   

                if(!message.content.startsWith(prefix)) return;

                if(message.content.startsWith(prefix)) {

                    if(dados.userBanned == 'banned') {
                        let banned = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('<:DiscordBan:790934280481931286> Você foi banido(a) <:DiscordBan:790934280481931286>')
                        .setDescription('Você foi banido(a) de usar a Foxy em qualquer servidor no Discord! \n Caso seu ban foi injusto (o que eu acho muito difícil) você pode solicitar seu unban no meu [servidor de suporte](https://discord.gg/kFZzmpD) \n **Leia os termos em** [Termos de uso](https://foxywebsite.ml/tos.html)')
                        .setFooter('You have been banned from using Foxy on other servers on Discord!')
                        return message.author.send(banned).catch((error) => {
                            message.channel.send(banned)
                        })
                    }
                }
                command.execute(client, message, args)

            }
        })

	} catch (error) {
        const errorMessage = error.stack.length > 1100 ? `${error.stack.slice(0, 1100)}...` : error.stack
        const embed = new Discord.MessageEmbed()
        embed.setColor('RED')
        embed.setTitle(`<:BSOD:777579371870683147> Ocorreu um erro ao usar este comando`)
        embed.setDescription(`\`\`\`js\n${errorMessage}\`\`\``)
        embed.setFooter('Reporte para minha equipe usando f!report <issue>')
		console.error(error);
		message.reply(embed);
	}
});

client.login(token);