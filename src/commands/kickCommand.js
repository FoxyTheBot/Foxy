const Discord = require('discord.js');

const db = require('quick.db')

module.exports = {
    name: "kick",
    description: "Kicks a member from the server",

    async run (client, message, args) {

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send('Você não pode usar isto!')
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send('Eu não tenho as permissões corretas para fazer isto')

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!args[0]) return message.channel.send('Por favor, especifique um usuário!');

        if(!member) return message.channel.send('Eu não consigo encontrar este usuário, desculpe.');
        if(!member.kickable) return message.channel.send('Este usuário possui um cargo maior que o meu.');

        if(member.id === message.author.id) return message.channel.send('Bruh, você não pode se expulsar');

        let reason = args.slice(1).join(" ");

        if(!reason) reason = 'Não especificado';

        member.kick(reason)
            .catch(err => {
                if(err) return message.channel.send('Algo deu errado')
            })

        const kickembed = new Discord.MessageEmbed()
            .setTitle('Alguém foi punido...')
            .setThumbnail(member.user.displayAvatarURL())
            .addField('Usuário expulso', member)
            .addField('Expulso por:', message.author)
            .addField('Motivo', reason)
            .setFooter('Tempo:', client.user.displayAvatarURL())
            .setTimestamp()

        message.channel.send(kickembed);
    }
}

module.exports.help = {
    name: "kick",
	aliases: ["expulsar", "kick"]
}