const Discord = require('discord.js')
module.exports = {
    name: "donate",
    aliases: ['donate', 'doar'],
    cooldown: 3,
guildOnly: false,
    async execute(client, message, args) {
         
        let embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTitle('(._.`) Sabia que a crise afeta todos nós?')
            .setDescription('Eu preciso de dinheiro para ficar online<a:bugcat_sleepy:776250262146515006> \nVocê pode doar para mim clicando [aqui](https://www.paypal.com/donate/?hosted_button_id=J7Y747Q38UEKN) 90% do dinheiro é para pagar a hospedagem e 10% é para o desenvolvedor, lembrando que eu também aceito doações via cartão de crédito e PayPal<:paypal:776965353904930826>')

        message.channel.send(embed);
    }
}