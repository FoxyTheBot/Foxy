const db = require("quick.db");
const Discord = require('discord.js')
module.exports = {
    name: "roulette",
    aliases: ['roulette', 'roleta', 'girar'],
    cooldown: 3,
    guildOnly: true,

    async execute(client, message, args) {
        let user = message.author;

        function isOdd(num) { 
          if ((num % 2) == 0) return false;
          else if ((num % 2) == 1) return true;
      }
          
      let colour = args[0];
      let money = parseInt(args[1]);
      let moneydb = await db.fetch(`coins_${user.id}`)
      
      let random = Math.floor(Math.random() * 37);
      const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle('❓ Como usar')
      .setDescription('❓ **Use:** `f!roleta <cor> <quantidade>` \n ❤ **Quais cores?** \n `Red, Black e Green`')
      .setFooter('f!roleta - Economia')
      
          if (!colour)  return message.channel.send(embed);
          colour = colour.toLowerCase()
          if (!money) return message.channel.send(`Especifique uma quantia para jogar | f!roleta <cor> <quantidade>`); 
          if (money > moneydb) return message.channel.send(`Você está apostando mais do que tem`);
          
          if (colour == "b" || colour.includes("black")) colour = 0;
          else if (colour == "r" || colour.includes("red")) colour = 1;
          else if (colour == "g" || colour.includes("green")) colour = 2;
          else return message.channel.send(`Especifique uma cor em inglês | Red [1.5x] Black [2x] Green [15x]`);
          
          
          
          if (random == 0 && colour == 2) { // Green
              money *= 15
              db.add(`coins_${user.id}`, money)

              message.channel.send(`Você ganhou ${money} coins! Múltiplo: 15x`)
              
          } else if (isOdd(random) && colour == 1) { // Red
              money = parseInt(money * 1.5)
              db.add(`coins_${user.id}`, money)

              message.channel.send(`Você ganhou ${money} coins! Múltiplo: 1.5x`)
          } else if (!isOdd(random) && colour == 0) { // Black
              money = parseInt(money * 2)
              db.add(`coins_${user.id}`, money)
              message.channel.send(`Você ganhou ${money} coins! Múltiplo: 2x`)
          } else { // Wrong
              db.subtract(`coins_${user.id}`, money)
              message.channel.send(`Você perdeu ${money} coins. Múltiplo: 0x`)
          }
    }
}