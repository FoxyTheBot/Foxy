const Discord = require("discord.js")
exports.run = async (bot, message, argumentos, arg_texto, chat) => {
  
  const ajuda = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Lista de comandos!")
    .setThumbnail(`https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024`)
    .setDescription("Reagir de acordo com o  que procura!\n\n📚 - Informações\n\n🛡 - Administrativos\n\n🎊 - Diversão \n\n🕹 - RolePlay \n\n💾 - Miscelâneas")
    .setTimestamp()
    .setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL({Size: 32}))   
    
  message.channel.send(ajuda).then(msg => {
    msg.react('📚').then(r => {
      msg.react('🛡').then(r => {
    msg.react('🎊').then(r => {
      msg.react('🕹').then(r => {
      msg.react('💾').then(r => {

        })
      })
      })
    })
  })
    
    const infosFilter = (reaction, user) => reaction.emoji.name === '📚' && user.id === message.author.id;
        const admFilter = (reaction, user) => reaction.emoji.name === '🛡' && user.id === message.author.id;
    const funFilter = (reaction, user) => reaction.emoji.name === '🎊' && user.id === message.author.id;
    const rpFilter = (reaction, user) => reaction.emoji.name === '🕹' && user.id === message.author.id;
    const MiscFilter = (reaction, user) => reaction.emoji.name === '💾' && user.id === message.author.id;

    
    const infos = msg.createReactionCollector(infosFilter);
        const adm = msg.createReactionCollector(admFilter);
    const fun = msg.createReactionCollector(funFilter);
    const Misc = msg.createReactionCollector(MiscFilter);
    const role = msg.createReactionCollector(rpFilter)
  

    infos.on('collect', r2 => {
      
      ajuda.setTitle("Comandos informativos!")
      ajuda.setDescription("f!help - Mostra os comandos do bot! \n f!botinfo - Mostra as informações do bot \n ")
      msg.edit(ajuda)
      
    })
    
    adm.on('collect', r2 => {
      
      ajuda.setTitle("Comandos de administração!")
      ajuda.setDescription(" f!kick - Expulsa um usuário \n f!clear - Limpa até 99 mensagens em um canal \n f!ban - Ban um membro! \n f!unban - Desban um membro!")
      msg.edit(ajuda)
      
    })
    
    fun.on('collect', r2 => {
      
      ajuda.setTitle("Comandos de diversão!")
      ajuda.setDescription(" f!ship faça ships com um usuário :3 \n f!8ball - Me pergunte algo \n f!say - Você fala e eu repito \n f!coinflip - Cara ou coroa?")
      msg.edit(ajuda)
      
    })
    role.on('collect', r2 => {
      ajuda.setTitle("Comandos de Roleplay")
     ajuda.setDescription(" f!kill - para ~~atirar~~ em algúem \n f!attack - para atacar alguém \n f!kiss - Beije um usuário \n f!hug - Abraçe um usuário \n f!lick - Lamba um usuário \n f!trava - Trave um zap hehe \n f!pat - Faça Cafuné em um usuário \n f!slap - bata em um usuário")
    msg.edit(ajuda)
    })
    Misc.on('collect', r2 => {
      ajuda.setTitle("Miscelâneas")
      ajuda.setDescription(" f!report - Entre em contato direto com o criador \n f!embed - Construa uma embed usando a base `f!say` \n f!ad - faça anúncio em um canal \n f!cancel - Cancele um usuário \n f!invite - Me envie para o seu servidor \n f!avatar - Veja uma foto de perfil \n f!github - GitHub do meu criador :D \n f!crab - 🦀")
      msg.edit(ajuda)
    })
  })  
} 