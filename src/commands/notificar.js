exports.run = async(client, Message) => {
    if ( Message.channel.type == "dm" ||  Message.guild.id != "768267522670723094" ) return Message.channel.send('Este comando pode ser utilizado apenas no meu servidor!')
    if ( !Message.member.roles.cache.has("768275121290870814") ) Message.member.roles.add("768275121290870814"), Message.channel.send("Agora você vai receber todas as minhas novidades <:meow_blush:768292358458179595>")
    else Message.member.roles.remove("768275121290870814"), Message.channel.send("Agora você não vai mais receber minhas novidades <:sad_cat_thumbs_up:768291053765525525>")
}