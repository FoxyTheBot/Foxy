const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {

  //!tempmute @user 1s/m/h/d

  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("Usuário não encontrado :(");
  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Não consigo mutar ele");
let muterole = message.guild.roles.find(muterole => muterole.name === "muted");
  //start of create role
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if(!mutetime) return message.reply("Você não colocou o tempo específico");

  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> Foi mutado por ${ms(ms(mutetime))}`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    message.channel.send(`Quem mandou quebrar as regras! <@${tomute.id}> Foi mutado!`);
  }, ms(mutetime));


//end of module
}

module.exports.help = {
  name: "tempmute"
}