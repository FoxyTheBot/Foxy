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

        if(!role) return message.channel.send("Eu não consigo encontrar o cargo `Silenciado`");

        let reason = args.slice(1).join(" ");
        if(reason === null) reason = "Não especificado"

        user.roles.add(role);

        await message.channel.send(`${user} Foi mutado por: ${reason}`)

        user.send(`Olá! Você foi silenciado em ${message.guild.name} pelo motivo: ${reason}`);
    }

}