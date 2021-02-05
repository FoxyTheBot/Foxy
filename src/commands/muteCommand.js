module.exports = {
name: "mute",
aliases: ['mute', 'silenciar', 'mutar'],
cooldown: 3,
guildOnly: true,
async execute(client, message, args) {        
    
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Você não a permissão `Gerenciar Cargos` para realizar esta ação");

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user) message.channel.send("Este usuário não foi encontrado");

        if(user.id === message.author.id) return message.channel.send("Você não pode mutar a si mesmo!");
        let role = message.guild.roles.cache.find(x => x.name === "Silenciado"); 

        if(!role) {
          
            message.channel.send("Como eu não consegui encontrar o cargo `Silenciado` eu irei criar um para você :)")
            message.guild.roles.create(
                { 
                    data: {
                        name: "Silenciado"
                }, 
                reason: 'Cargo silenciado', 
                mentionable: false
            });
                    let role = message.guild.roles.cache.find(x => x.name === "Silenciado"); 

            role.overwritePermissions([
                {
                    id: role.id,
                    deny: ['SEND_MESSAGES', 'SPEAK'],
                },
            
            ]);
        
        } else {

       
     
        let reason = args.slice(1).join(" ");
        if(!reason) reason = "Não especificado"

        user.roles.add(role);

        await message.channel.send(`${user} Foi mutado por: ${reason}`)
        message.channel.send(`${user} foi silenciado por ${reason}`) 

        }
    }

}