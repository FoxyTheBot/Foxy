const Discord = require('discord.js')
module.exports = {

    run: async (client, message, args) => {
         
        let embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTitle('(._.`) Sabia que a crise afeta todos nós?')
            .setDescription('Eu preciso de dinheiro para ficar online<a:bugcat_sleepy:776250262146515006> \nVocê pode doar para mim clicando [aqui](https://www.paypal.com/donate/?hosted_button_id=J7Y747Q38UEKN) 90% do dinheiro é para pagar a hospedagem e 10% é para o desenvolvedor, lembrando que eu também aceito doações via boleto, cartão de crédito e PayPal<:paypal:776965353904930826>')
        .setFooter('Caso queira doar em boleto entre em contato com WinG4merBR#5995')

        message.channel.send(embed);
    }
};

module.exports.help = { 
	name: 'donate',
	aliases: ["doar", "donate", "doarparacomer"]
  }