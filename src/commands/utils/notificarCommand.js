module.exports = {
  name: 'notificar',
  aliases: ['notificar', 'notify'],
  async run(client, message, args) {
    if (message.channel.type == 'dm' || message.guild.id != '768267522670723094') return message.inlineReply('Este comando pode ser utilizado apenas no meu servidor!');

    switch(args[0]) {
      case 'background':

        if (!message.member.roles.cache.has('820429661641113614')) message.member.roles.add('820429661641113614'), message.inlineReply('Agora você vai receber avisos de novos backgrounds! <:meow_blush:768292358458179595>');
        else message.member.roles.remove('820429661641113614'), message.inlineReply('Agora você não vai mais receber novos backgrounds <:sad_cat_thumbs_up:768291053765525525>');
      
        break;
        
        default:

        if (!message.member.roles.cache.has('768275121290870814')) message.member.roles.add('768275121290870814'), message.inlineReply('Agora você vai receber todas as minhas novidades <:meow_blush:768292358458179595>');
          else message.member.roles.remove('768275121290870814'), message.inlineReply('Agora você não vai mais receber minhas novidades <:sad_cat_thumbs_up:768291053765525525>');
       
    }
  },

};
