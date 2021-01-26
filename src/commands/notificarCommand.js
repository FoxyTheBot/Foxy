module.exports = { 
    name: "notificar",
    aliases: ['notificar', 'notify'],
    async execute(client, message, args) {
    if ( message.channel.type == "dm" ||  message.guild.id != "768267522670723094" ) return message.channel.send('Este comando pode ser utilizado apenas no meu servidor!')
    if ( !message.member.roles.cache.has("802973366860251158") ) message.member.roles.add("802973366860251158"), message.channel.send("Agora você vai receber todas as minhas novidades antecipadas <:meow_blush:768292358458179595>")
    else message.member.roles.remove("802973366860251158"), message.channel.send("Agora você não vai mais receber minhas novidades <:sad_cat_thumbs_up:768291053765525525>")
}

}