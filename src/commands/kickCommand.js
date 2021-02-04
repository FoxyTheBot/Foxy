const Discord = require('discord.js')
module.exports = {
name: "kick",
aliases: ['kick', 'expulsar'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {
  const { prefix } = require('../config.json')
  if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send('Você não tem permissão para usar isto!')
  if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send('Eu não tenho as permissões corretas')

  const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

  if(!args[0]) return message.channel.send('Por favor especifique um usuário');

  if(!member) return message.channel.send('Eu não encontrei este usuário.');
  if(!member.bannable) return message.channel.send('Eu não posso expulsar este usuário ele possui um cargo maior que o meu <:sad_cat_thumbs_up:768291053765525525>');

  if(member.id === message.author.id) return message.channel.send('Opa calma ai! Você não pode expulsar a si mesmo!');

  let kickReason = args.slice(1).join(" ");

  if(!kickReason) kickReason = 'Motivo não especificado';

  member.kick()
      .catch(err => {
          if(err) return message.channel.send(`Algo deu errado ao expulsar este usuário ${err}`)
      })

  const kickembed = new Discord.MessageEmbed()
      .setTitle('<:DiscordBan:790934280481931286> Alguém quebrou as regras...')
      .setThumbnail(member.user.displayAvatarURL())
      .addField('Usuário expulso', member)
      .addField('Punido por', message.author)
      .addField('Motivo', kickReason)
      .setFooter('Tempo de kick', client.user.displayAvatarURL())
      .setTimestamp()

  message.channel.send(kickembed);

    }

}