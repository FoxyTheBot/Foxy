const Discord = require('discord.js');
exports.run = async (client, message, args) => {

  const user = args.join(' ');
  if(user == message.author) return message.channel.send('Você não pode se avaliar')
  if (user == client.user) return message.channel.send('Eu dou nota **10** para <@737044809650274325> sim eu sou muito linda 😘')
       if(user == 758885367847190568) return message.channel.send(`Sobre ${user}... Eu dou nota **10** para essa waifu. Essa waifu é perfeita! Eu não trocaria ela por nada se fosse você! <:meow_blush:768292358458179595>`)
  message.delete().catch(O_o => {});
var list = [
  '**1** para essa waifu. Eu não gostei <:hmmm:779010951420051457>',
  '**5** para essa waifu. <:hmmm:779010951420051457> ',
  '**7** para essa waifu. Achei ela bonitinha <:MeowPuffyMelt:776252845493977088> ',
    '**4** para essa waifu. Bonitinha <:hmmm:779010951420051457>',
    '**3** para essa waifu. Bonitinha, mas acho que pode melhorar *na minha opinião*',
    '**5** para essa waifu.',
    '**8** para essa waifu.',
    '**10** para essa waifu. Essa waifu é perfeita! Eu não trocaria ela por nada se fosse você! <:meow_blush:768292358458179595>'
];
    
var rand = list[Math.floor(Math.random() * list.length)];

  await message.channel.send(`Sobre ${user}... Eu dou nota ${rand}`);
}