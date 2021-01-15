const Discord = require('discord.js')
const translate = require('@k3rn31p4nic/google-translate-api')

exports.run = async(client, message, args) => {
    let language = args[0];
    let text = args.slice(1).join(" ")

        if(!language) return message.reply("Especifique um idioma")
        if (language.length !== 2) return message.reply('Use apenas abreviações. Exemplo: `f!language en Olá Mundo!`')
        if(!text) return message.reply('Insira um texto')

    
    const result = await translate(text, { to: language})
        const embed = new Discord.MessageEmbed()
        .setColor('#802d5a')
        .setTitle(':map: | Translator')
        .setDescription(`${result.text}`)

    message.channel.send(`${message.author}`, embed)
    }