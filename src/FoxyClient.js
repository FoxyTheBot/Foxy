const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, owners, logsWebhook, reportWebhook, canary } = require('../config.json');
const user = require('./models/user');

const cooldowns = new Discord.Collection();

const foxyIntents = new Discord.Intents(Discord.Intents.ALL);

foxyIntents.remove(Discord.Intents.PRIVILEGED);

const client = new Discord.Client({
    ws: {
        intents: foxyIntents
    }
});
client.logsWebhook = new Discord.WebhookClient(logsWebhook.id, logsWebhook.token);
client.reportWebhook = new Discord.WebhookClient(reportWebhook.id, reportWebhook.token);
client.commands = new Discord.Collection();


const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    let eventBind = file.split('.')[0];
    console.info(`\x1b[37m\x1b[44mINFO\x1b[0m: Loading event: ${file}; Bind: ${eventBind}`);
    client.on(eventBind, event.bind(null, client));
}

function foxySelfReport(error, context) {
    console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Um erro ocorreu no tempo de execução!', error);
    const errorSliced = error.stack.length > 1000 ? `${error.stack.slice(0, 1000)}...` : error.stack;
    const reportEmbed = new Discord.MessageEmbed()
        .setTitle(':bug: | Issue Report automático da Foxy')
        .setColor('#5555DD')
        .addFields(
            { name: ":technologist: Usuário:", value: `<@${context.author.id}>` },
            { name: ":tools: Guild:", value: `${context.guild.name}; ID: ${context.guild.id}` },
            { name: ":wrench: Request:", value: `${context.content}` },
            { name: "<:bug_hunter:789668194494709761> Issue:", value: `\n\`\`\`js\n${errorSliced}\`\`\`` }
        )
        .setFooter('Verifique o console para mais informações!');
    const replyEmbed = new Discord.MessageEmbed()
        .setTitle('<:BSOD:777579371870683147> | Ocorreu um erro ao usar este comando')
        .setColor('RED')
        .setDescription(`\`\`\`js\n${errorSliced}\`\`\``)
        .setFooter('<:bug_hunter:789668194494709761> Não se preocupe! esse erro foi reportado automaticamente para minha equipe!');
    client.reportWebhook.send(reportEmbed).catch(err => {
        if (err) {
            console.error('\x1b[37m\x1b[41mERROR\x1b[0m: O report automatico falhou! verifique o webhook de reporte!', err);
            replyEmbed.setFooter('Reporte para minha equipe usando f!report <issue>');
        }
    })
    return context.reply(replyEmbed);
}

client.on("message", message => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.webhookID) return;
if(canary) {
    message.channel.send('<:meowbughunter:776249240463736834> Você está usando a versão experimental da Foxy, algumas coisas podem não funcionar, posso ficar offline a qualquer momento. Enfim, não reporte bugs na versão experimental.')
}
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    function foxyCommandHandler() {

        if (command.guildOnly && message.channel.type === 'dm') {
            return message.channel.send(`<:Error:718944903886930013> | ${message.author} Esse comando não pode ser executado em mensagens diretas!`);
        }

        if (command.ownerOnly && !owners.includes(message.author.id)) {
            return message.channel.send(`<:Error:718944903886930013> | ${message.author} Você não tem permissão para fazer isso! <:meow_thumbsup:768292477555572736>`);
        }

        if (command.argsRequired && !args.length) {
            return message.channel.send(`<:Error:718944903886930013> | ${message.author} Esse comando precisa de argumentos para ser executado!`);
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
                return message.channel.send(`:fire: **|** ${message.author}, Por favor aguarde **${timeLeft.toFixed(0)} segundos** para usar o comando novamente`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        command.execute(client, message, args);
    }
    try {
        user.findOne({ userid: message.author.id }, function (error, data) {
            if (error) return foxySelfReport(error, message);
            if (data) {
                if (data.userBanned) {
                    let bannedEmbed = new Discord.MessageEmbed()
                        .setTitle('<:DiscordBan:790934280481931286> Você foi banido(a) <:DiscordBan:790934280481931286>')
                        .setColor('RED')
                        .setDescription('Você foi banido(a) de usar a Foxy em qualquer servidor no Discord! \n Caso seu ban foi injusto (o que eu acho muito difícil) você pode solicitar seu unban no meu [servidor de suporte](https://discord.gg/kFZzmpD) \n **Leia os termos em** [Termos de uso](https://foxywebsite.ml/tos.html)')
                        .setFooter('You\'ve been banned from using Foxy on other servers on Discord!');
                    return message.author.send(bannedEmbed).catch(() => {
                        message.channel.send(bannedEmbed);
                    });
                } else {
                    return foxyCommandHandler();
                }
            } else {
                new user({
                    userid: message.author.id,
                    username: message.author.username,
                    userBanned: false
                }).save().catch(err => {
                    foxySelfReport(err, message);
                });
                return foxyCommandHandler();
            }
        });
    } catch (error) {
        foxySelfReport(error, message);
    }
})

client.login(token);