const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
    name: "serverinfo",
    aliases: ['serverinfo', 'aboutserver'],
    cooldown: 5,
    guildOnly: true,

    async execute(client, message, args) {

        var servericon = message.guild.iconURL();
        moment.locale('pt-br');
        const joinDiscord = moment(message.guild.createdAt).format('lll');
        const clientjoin = moment(message.guild.joinedTimestamp).format('lll');
let verification = message.guild.verificationLevel

var level = verification.replace("MEDIUM", 'Médio').replace("HIGH", "Alto").replace("LOW", "Baixo").replace("HIGHEST" ,"Muito Alto").replace("NONE", "Sem verificação")
        
const embed = new Discord.MessageEmbed()
        .setColor('b2fba4')
        .setTitle(message.guild.name)
        .setThumbnail(servericon)
        .addFields(
            {name: ":crown: Owner", value: `${message.guild.owner}`, inline: true},
            { name: "<:info:718944993741373511> Owner ID", value: `\`${message.guild.ownerID}\``, inline: true},
            {name: ":earth_americas: Região", value: `${message.guild.region}`, inline: true},
            {name: ":computer: Server ID", value: `\`${message.guild.id}\``, inline: true},
            { name: ":busts_in_silhouette: Membros", value: `${message.guild.memberCount}`, inline: true},
            {name: ":calendar: Criado em:", value: `${joinDiscord}`, inline: true},
            { name: ":star: Entrei aqui em:", value: `${clientjoin}`, inline: true},
            { name: ":computer: Shard ID", value: `${message.guild.shardID}`, inline: true},
            { name: "<a:sleeepy:803647820867174421> Canal AFK", value: `${message.guild.afkChannel}`, inline: true},
            { name: "<:rules:797183150475575337> Canal de regras", value: `${message.guild.rulesChannel}`, inline: true},
            { name: "<:WindowsShield:777579023249178625> Nível de verificação", value: `${level}`, inline: true},
            { name: "<:DiscordPartner:763767066150305812> Servidor Parceiro:", value: `${message.guild.partnered}`, inline: true}
        )
    .setFooter("Caso não apareça o dono, peça para o dono do servidor executar o comando duas vezes ;) ")
        message.channel.send(embed)

    }
}