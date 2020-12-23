const Discord = require("discord.js")
exports.run = async (bot, message, argumentos, arg_texto, chat) => {
   message.delete().catch(O_o => {});
  const ajuda = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Lista de comandos")
    .setThumbnail(`https://cdn.discordapp.com/avatars/737044809650274325/64b92e7d5e7fb48e977e1f04ef13369d.png?size=1024`)
    .setDescription("Reagir de acordo com o que procura \n\n📚 - Informações\n\n🛡 - Administrativos\n\n🎊 - Diversão \n\n🕹 - RolePlay \n\n💿 - Atalhos do Discord \n\n💾 - Miscelâneas")
    .setTimestamp()
    .setFooter(`Comando solicitado por ${message.member.displayName}`, message.author.displayAvatarURL({Size: 32}))   
    
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
      ajuda.setTitle("Comandos informativos")
      ajuda.setDescription(" **f!userinfo** \n `Para ver infos de um user no Discord` \n **f!commandos** \n `Mostra minha lista de comandos | Sinônimos: f!commands` \n **f!termos** \n `Termos de Uso da Foxy` \n **f!help** \n `Mostra a mensagem de ajuda` \n **f!botinfo** \n `Mostra as informações do bot` \n **f!ping** \n `Para ver meu tempo de resposta`")
      msg.edit(ajuda)
      
    })
    
    adm.on('collect', r2 => {
      ajuda.setColor('RANDOM')
      ajuda.setTitle("Comandos de administração")
      ajuda.setDescription(" **f!dm** \n `Envia mensagens da DM de um usuário (Se a DM estiver aberta)` \n **f!addrole** \n `Para dar um cargo para alguém` \n **f!clear** \n `Limpa até 99 mensagens em um canal`")
      msg.edit(ajuda)
      
    })
    
    fun.on('collect', r2 => {
      ajuda.setColor('BLACK')
      ajuda.setTitle("Comandos de diversão")
      ajuda.setDescription(" **f!ratewaifu** \n `Vamos ver o que eu acho da sua waifu...` \n **f!clyde** \n `gere uma mensagem personalizada do ClydeBot` \n **f!eventos** \n `Para ver minha lista de mensagens automaticas` \n **f!esponja** \n `Cria um meme do bob esponja` \n **f!comunismo** \n `Nosso bot (cria meme comunista)` \n **f!laranjo** \n `Crie um meme do Laranjo` \n **f!say** \n `você diz e eu repito` \n **f!morse** \n `Decodificador e codificador Morse` \n **f!tf** \n `É verdade ou é falso?` \n **f!fate** \n `oq eu sou seu?` \n **f!cancel** \n \`Cancele um usuário` \n **f!avatar** \n `Veja uma foto de perfil` \n **f!putin** \n `Crie um meme do Putin Andando` \n **f!emoji** \n `Para ver um emoji` \n **f!ship** \n `faça ships com um usuário :3` \n **f!8ball** \n `Me pergunte algo` \n **f!coinflip** \n `Cara ou coroa?`")
      msg.edit(ajuda)
      
    })
    role.on('collect', r2 => {
      ajuda.setColor('YELLOW')
      ajuda.setTitle("Comandos de Roleplay")
     ajuda.setDescription(" **f!bite** \n `Para morder alguém` \n **f!applause** \n `Para aplaudir algúem` \n **f!stare** \n `Para encarar alguém` \n **f!run** \n `Para correr` \n **f!shy** \n `Se você está timido só usar esse comando` \n **f!smile** \n `Para sorrir` \n **f!moonwalk** \n `Vire o Michael Jackson e faça o Moonwalk` \n **f!scream** \n `Para gritar` \n **f!dance** \n `Para dançar` \n **f!laugh** \n `Alguém te contou uma piada? Então ria usando este comando :D` \n **f!sad** \n `Mostre que você está triste` \n **f!attack <usuário>** \n `Para atacar um usuário` \n **f!kiss*** <usuário> \n `Beije um usuário` \n **f!hug** \n `Abraçe um usuário` \n **f!lick** \n `Lamba um usuário` \n **f!pat** \n `Faça Cafuné em um usuário` \n **f!slap** \n `bata em um usuário`")
    msg.edit(ajuda)
    })
    Misc.on('collect', r2 => {
      ajuda.setColor('BLUE')
      ajuda.setTitle("Miscelâneas")
      ajuda.setDescription(" **f!ticket** \n `crie um canal temporário em um servidor` \n **f!donate** \n `Para doar para mim <3` \n **f!id** \n `Mostra a sua ID do Discord` \n **f!vote** \n `Para votar em mim` \n **f!ideia** \n `Faça uma votação ou diga sua ideia sobre um servidor` \n **f!report** \n `Reporte algum erro no meu servidor de suporte` \n **f!ad** \n `faça anúncio em um canal` \n **f!invite** \n `Me envie para o seu servidor` \n **f!github** \n `GitHub do desenvolvedor` \n **f!partner** \n `Gera um link de servidor parceiro`")
      msg.edit(ajuda)
    })
    Discord.on('collect', r2 => {
      ajuda.setColor('BLUE')
      ajuda.setTitle('Atalhos do Discord')
      ajuda.setDescription(' **f!dpartner** \n `Como fazer parceria com o Discord` \n **f!nitro** \n `Como e onde comprar Discord Nitro` \n **f!reports** \n `Como denunciar no Discord` \n**f!dst** \n `Status do Discord`')
    msg.edit(ajuda)
    })
    
  })

}