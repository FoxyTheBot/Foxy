<<<<<<< HEAD
const Discord = require("discord.js")
exports.run = async (bot, message, argumentos, arg_texto, chat) => {
  
  const ajuda = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Lista de comandos")
    .setThumbnail(`https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024`)
    .setDescription("Reagir de acordo com o que procura \n\n📚 - Informações\n\n🛡 - Administrativos\n\n🎊 - Diversão \n\n🕹 - RolePlay \n\n💾 - Miscelâneas")
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
    const dcFilter = (reaction, user) => reaction.emoji.name === '💬' && user.id === message.author.id;
    const MiscFilter = (reaction, user) => reaction.emoji.name === '💾' && user.id === message.author.id;

    
    const infos = msg.createReactionCollector(infosFilter);
        const adm = msg.createReactionCollector(admFilter);
    const fun = msg.createReactionCollector(funFilter);
    const Misc = msg.createReactionCollector(MiscFilter);
    const role = msg.createReactionCollector(rpFilter)
    const Discord = msg.createReactionCollector(dcFilter)
  

    infos.on('collect', r2 => {
      ajuda.setColor('RANDOM')
      ajuda.setTitle("Comandos informativos")
      ajuda.setDescription("f!help - Mostra os comandos do bot! \n f!botinfo - Mostra as informações do bot \n f!ping - Para ver meu tempo de resposta")
      msg.edit(ajuda)
      
    })
    
    adm.on('collect', r2 => {
      ajuda.setColor('RANDOM')
      ajuda.setTitle("Comandos de administração")
      ajuda.setDescription(" f!dm - Envie alguma mensagem para a dm de seus membros \n f!kick - Expulsa um usuário \n f!clear - Limpa até 99 mensagens em um canal \n f!ban - Ban um membro! \n f!unban - Desban um membro!")
      msg.edit(ajuda)
      
    })
    
    fun.on('collect', r2 => {
      ajuda.setColor('BLACK')
      ajuda.setTitle("Comandos de diversão")
      ajuda.setDescription(" f!fate - oq eu sou seu? \n f!cancel - Cancele um usuário \n f!avatar - Veja uma foto de perfil \n f!putin - Crie um meme do Putin Andando \n f!emoji - Para ver um emoji \n f!ship - faça ships com um usuário :3 \n f!8ball - Me pergunte algo \n f!say - Você fala e eu repito \n f!coinflip - Cara ou coroa?")
      msg.edit(ajuda)
      
    })
    role.on('collect', r2 => {
      ajuda.setColor('YELLOW')
      ajuda.setTitle("Comandos de Roleplay")
     ajuda.setDescription(" f!shy - timido \n f!smile - Para sorrir \n f!moonwalk - HEE HEE \n f!scream - AAAAAAAA \n f!dance - Para dançar \n f!laugh- Ta rindo do que? \n f!sad - Ta triste? \n f!attack - fazer um duelo de titãs? pq não :3 \n f!kiss - Beije um usuário \n f!hug - Abraçe um usuário \n f!lick - Lamba um usuário \n f!pat - Faça Cafuné em um usuário \n f!slap - bata em um usuário")
    msg.edit(ajuda)
    })
    Misc.on('collect', r2 => {
      ajuda.setColor('BLUE')
      ajuda.setTitle("Miscelâneas")
      ajuda.setDescription(" f!vote - Para votar em mim \n f!ideia - Faça uma votação ou diga sua ideia sobre um servidor \n f!report - Entre em contato direto com o criador \n f!embed - Construa uma embed usando a base `f!say` \n f!ad - faça anúncio em um canal \n f!invite - Me envie para o seu servidor \n f!github - GitHub do meu criador :D \n f!crab - 🦀 \n f!partner - Gera um link de servidor parceiro")
      msg.edit(ajuda)
    })
    
  })
=======
const Discord = require("discord.js")
exports.run = async (bot, message, argumentos, arg_texto, chat) => {
  
  const ajuda = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Lista de comandos")
    .setThumbnail(`https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024`)
    .setDescription("Reagir de acordo com o que procura \n\n📚 - Informações\n\n🛡 - Administrativos\n\n🎊 - Diversão \n\n🕹 - RolePlay \n\n💾 - Miscelâneas")
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
    const dcFilter = (reaction, user) => reaction.emoji.name === '💬' && user.id === message.author.id;
    const MiscFilter = (reaction, user) => reaction.emoji.name === '💾' && user.id === message.author.id;

    
    const infos = msg.createReactionCollector(infosFilter);
        const adm = msg.createReactionCollector(admFilter);
    const fun = msg.createReactionCollector(funFilter);
    const Misc = msg.createReactionCollector(MiscFilter);
    const role = msg.createReactionCollector(rpFilter)
    const Discord = msg.createReactionCollector(dcFilter)
  

    infos.on('collect', r2 => {
      ajuda.setColor('RANDOM')
      ajuda.setTitle("Comandos informativos")
      ajuda.setDescription("f!help - Mostra os comandos do bot! \n f!botinfo - Mostra as informações do bot \n f!ping - Para ver meu tempo de resposta")
      msg.edit(ajuda)
      
    })
    
    adm.on('collect', r2 => {
      ajuda.setColor('RANDOM')
      ajuda.setTitle("Comandos de administração")
      ajuda.setDescription(" f!dm - Envie alguma mensagem para a dm de seus membros \n f!kick - Expulsa um usuário \n f!clear - Limpa até 99 mensagens em um canal \n f!ban - Ban um membro! \n f!unban - Desban um membro!")
      msg.edit(ajuda)
      
    })
    
    fun.on('collect', r2 => {
      ajuda.setColor('BLACK')
      ajuda.setTitle("Comandos de diversão")
      ajuda.setDescription(" f!fate - oq eu sou seu? \n f!cancel - Cancele um usuário \n f!avatar - Veja uma foto de perfil \n f!putin - Crie um meme do Putin Andando \n f!emoji - Para ver um emoji \n f!ship - faça ships com um usuário :3 \n f!8ball - Me pergunte algo \n f!say - Você fala e eu repito \n f!coinflip - Cara ou coroa?")
      msg.edit(ajuda)
      
    })
    role.on('collect', r2 => {
      ajuda.setColor('YELLOW')
      ajuda.setTitle("Comandos de Roleplay")
     ajuda.setDescription(" f!shy - timido \n f!smile - Para sorrir \n f!moonwalk - HEE HEE \n f!scream - AAAAAAAA \n f!dance - Para dançar \n f!laugh- Ta rindo do que? \n f!sad - Ta triste? \n f!attack - fazer um duelo de titãs? pq não :3 \n f!kiss - Beije um usuário \n f!hug - Abraçe um usuário \n f!lick - Lamba um usuário \n f!pat - Faça Cafuné em um usuário \n f!slap - bata em um usuário")
    msg.edit(ajuda)
    })
    Misc.on('collect', r2 => {
      ajuda.setColor('BLUE')
      ajuda.setTitle("Miscelâneas")
      ajuda.setDescription(" f!vote - Para votar em mim \n f!ideia - Faça uma votação ou diga sua ideia sobre um servidor \n f!report - Entre em contato direto com o criador \n f!embed - Construa uma embed usando a base `f!say` \n f!ad - faça anúncio em um canal \n f!invite - Me envie para o seu servidor \n f!github - GitHub do meu criador :D \n f!crab - 🦀")
      msg.edit(ajuda)
    })
    
  })
>>>>>>> 4849578b0c5c2f2bc00528e9d14395b0384702c6
} 