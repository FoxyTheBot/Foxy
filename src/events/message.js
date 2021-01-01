module.exports = (client, message) => {
    if (message.author.bot) return;
    if (message.webhookID) return;

    if ( message.channel.type == "dm" ||  message.guild.id != "768267522670723094" ) return;

    if ( message.content.toLowerCase().startsWith("f!notificar") || message.content.toLowerCase().startsWith("f!notify") ) {
        if ( !message.member.roles.cache.has("768275121290870814") ) message.member.roles.add("768275121290870814"), message.channel.send("Agora você vai receber todas as minhas novidades <:meow_blush:768292358458179595>")
        else message.member.roles.remove("768275121290870814"), message.channel.send("Agora você não vai mais receber minhas novidades <:sad_cat_thumbs_up:768291053765525525>")
    }
        if (message.author.bot) return false;

  };
