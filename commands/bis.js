const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  
      message.delete().catch(O_o=>{});
  
  if(message.author.id === "331243426941239297") {
   const sayMessage = args.join(" ");
    message.channel.send("Olá Bis! Estamos Felizes com sua volta, sentimos muita saudades de vc!");
  }
}


module.exports.help = {
  name: "bis"
}