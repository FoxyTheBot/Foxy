const Discord = require('discord.js');

module.exports = { 
    name: "ban",
    aliases: ['ban', 'banir', 'adeus'],
    cooldown: 3,
    guildOnly: true,
    async execute(client, message, args) {

        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send('Você não tem permissão para usar isto!')
        if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send('Eu não tenho as permissões corretas')

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!args[0]) return message.channel.send('Por favor especifique um usuário');

        if(!member) return message.channel.send('Eu não encontrei este usuário.');
        if(!member.bannable) return message.channel.send('Eu não posso banir este usuário ele possui um cargo maior que o meu <:sad_cat_thumbs_up:768291053765525525>');

        if(member.id === message.author.id) return message.channel.send('Opa calma ai! Você não pode banir a si mesmo!');

        let banReason = args.slice(1).join(" ");

        if(!banReason) banReason = 'Motivo não especificado';

        member.ban({ reason: banReason })
            .catch(err => {
                if(err) return message.channel.send(`Algo deu errado ao expulsar este usuário ${err}`)
            })

        const banembed = new Discord.MessageEmbed()
            .setTitle('<:DiscordBan:790934280481931286> Alguém quebrou as regras...')
            .setThumbnail(member.user.displayAvatarURL())
            .addField('Usuário banido', member)
            .addField('Punido por', message.author)
            .addField('Motivo', banReason)
            .setFooter('Tempo de kick', client.user.displayAvatarURL())
            .setTimestamp()

        message.channel.send(banembed);


    }

}