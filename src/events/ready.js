
    
    const DBL = require("dblapi.js")
    const Sentry = require('@sentry/node')
    const { prefix, dbltoken } = require('../config.json')
    module.exports = async (client, config, user) => {
        const dbl = new DBL(dbltoken, client)
        dbl.postStats(client.guilds.cache.size, client.shard.ids, client.shard.count)
        dbl.on("error", console.error) 
    
            console.log(`[CONNECTION SUCCESSFULLY] - ${client.user.username} has been connected to Discord!`)
            let status = [
                { name: `❓ Se você precisa de ajude use ${prefix}help`, type: "WATCHING" },
                { name: `💻 Quer encontrar meus comandos use: ${prefix}commands`, type: "PLAYING" },
                { name: "🐦 Me siga no Twitter: @FoxyDiscordBot", type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
                { name: `💖 Fui criada pelo WinG4merBR#5995`, type: "LISTENING" },
                { name: `😍 Me adicione usando ${prefix}invite`, type: "WATCHING" },
                { name: `✨ Entre no meu servidor de suporte usando ${prefix}help`, type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
                { name: `🐛 Se você encontrou um bug use ${prefix}report para reportar falhas`, type: "PLAYING" },
                { name: `🍰 Minha comida preferida é bolo 💖`, type: "WATCHING"}
            ]
    
            setInterval(() => {
                let randomStatus = status[Math.floor(Math.random() * status.length)]
               client.user.setPresence({ activity: randomStatus })
            }, 10000)
            Sentry.init({ dsn: process.env.SENTRY_DSN })
        
        }