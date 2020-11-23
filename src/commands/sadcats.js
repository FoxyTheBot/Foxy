const Discord = require("discord.js")
exports.run = async (bot, message, argumentos, arg_texto, chat) => {
  
  const ajuda = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setImage(`https://i.ytimg.com/vi/lkT0PJoZ_QM/maxresdefault.jpg`)
    .setDescription('Clique nas reações para ver mais :3')  
    
  message.channel.send(ajuda).then(msg => {
    msg.react('📚').then(r => {
      msg.react('🛡').then(r => {
    msg.react('🎊').then(r => {
      msg.react('🕹').then(r => {
      msg.react('💾').then(r => {
        msg.react('💿').then(r => {

        })

        })
      })
      })
    })
  })
    
    const infosFilter = (reaction, user) => reaction.emoji.name === '📚' && user.id === message.author.id;
        const admFilter = (reaction, user) => reaction.emoji.name === '🛡' && user.id === message.author.id;
    const funFilter = (reaction, user) => reaction.emoji.name === '🎊' && user.id === message.author.id;
    const rpFilter = (reaction, user) => reaction.emoji.name === '🕹' && user.id === message.author.id;
    const dcFilter = (reaction, user) => reaction.emoji.name === '💿' && user.id === message.author.id;
    const MiscFilter = (reaction, user) => reaction.emoji.name === '💾' && user.id === message.author.id;

    
    const infos = msg.createReactionCollector(infosFilter);
        const adm = msg.createReactionCollector(admFilter);
    const fun = msg.createReactionCollector(funFilter);
    const Misc = msg.createReactionCollector(MiscFilter);
    const role = msg.createReactionCollector(rpFilter)
    const Discord = msg.createReactionCollector(dcFilter)
  

    infos.on('collect', r2 => {
      ajuda.setColor('RANDOM')
      ajuda.setTitle('<:sad_cat4:776251713967358013>')
      ajuda.setImage('https://i.ytimg.com/vi/lkT0PJoZ_QM/maxresdefault.jpg')
      msg.edit(ajuda)
      
    })
    
    adm.on('collect', r2 => {
        ajuda.setTitle('<:sad_cat4:776251713967358013>')
     ajuda.setImage('https://i.pinimg.com/736x/a3/50/9a/a3509a322887c2e75b5c6118fd759c97.jpg')
      msg.edit(ajuda)
      
    })
    
    fun.on('collect', r2 => {
        ajuda.setTitle('<:sad_cat4:776251713967358013>')
     ajuda.setImage('https://i.ytimg.com/vi/iQNqOIVATJU/maxresdefault.jpg')
      msg.edit(ajuda)
      
    })
    role.on('collect', r2 => {
        ajuda.setTitle('<:sad_cat4:776251713967358013>')
     ajuda.setImage('https://i.ytimg.com/vi/iQNqOIVATJU/maxresdefault.jpg')
     msg.edit(ajuda)
    })
    Misc.on('collect', r2 => {
        ajuda.setTitle('<:sad_cat4:776251713967358013>')
    ajuda.setImage('https://i.ytimg.com/vi/iQNqOIVATJU/maxresdefault.jpg')
    msg.edit(ajuda)
    })
    Discord.on('collect', r2 => {
        ajuda.setTitle('<:sad_cat4:776251713967358013>')
   ajuda.setImage('https://i.ytimg.com/vi/cLznjh9iXew/maxresdefault.jpg')
   msg.edit(ajuda)
    })
    
  })
} 