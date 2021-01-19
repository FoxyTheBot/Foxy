const { prefix } = require('../config.json')
module.exports = {
name: "ppt",
aliases: ['ppt'],
cooldown: 3,
guildOnly: false,
async execute(client, message, args) {
    const acceptedReplies = ['pedra', 'papel', 'tesoura'];
    const random = Math.floor((Math.random() * acceptedReplies.length));
    const result = acceptedReplies[random];

    const choice = args[0];
    if (!choice) return message.channel.send(`Como jogar \`${prefix}ppt <pedra|papel|tesoura\``);
    if (!acceptedReplies.includes(choice)) return message.channel.send(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);


    if (result === choice) return message.reply("Ei, dessa vez deu empate");

    switch (choice) {
        case 'pedra': {
            if (result === 'papel') return message.reply('Eu ganhei :3');
            else return message.reply('Yayyy você venceu!');
        }
        case 'papel': {
            if (result === 'tesoura') return message.reply('Eu ganhei :3');
            else return message.reply('Yeeey você venceu!');
        }
        case 'tesoura': {
            if (result === 'pedra') return message.reply('Eu ganhei OwO');
            else return message.reply('OwO você venceu! ^^');
        }
        default: {
            return message.channel.send(`Apenas estas respostas são aceitas: \`${acceptedReplies.join(', ')}\``);
        }
    }
}

}