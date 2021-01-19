const figlet = require('figlet');

module.exports = {
    name: "ascii",
    aliases: ['ascii'],
    cooldown: 1,
    guildOnly: false,
    
async execute(client, message, args) {
        if(!args[0]) return message.channel.send('Por favor Digite algo');

        msg = args.join(" ");

        figlet.text(msg, function (err, data){
            if(err){
                message.channel.send('Algo deu errado ao executar este comando');
                message.channel.send(err);
            }
            if(data.length > 2000) return message.channel.send('Por favor digite algo com menos de 2000 caractéres!')

            message.channel.send('```' + data + '```')
        })
    }

}