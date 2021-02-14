const DBL = require("dblapi.js");
const { prefix, dbltoken } = require('../../config.json');
module.exports = async (client) => {
    const dbl = new DBL(dbltoken, client);
    dbl.postStats(client.guilds.cache.size, client.shard.ids, client.shard.count);
    dbl.on("error", err => console.error('\x1b[37m\x1b[41mERROR\x1b[0m: Ocorreu um erro ao se conectar com a Discord Bot List API', err));

    console.info(`\x1b[37m\x1b[42mSUCCESS\x1b[0m: Foxy is ready! Logged as: ${client.user.tag}`);
    let status = [
        { name: `❓ Se você precisa de ajuda use ${prefix}help`, type: "WATCHING" },
        { name: `💻 Quer encontrar meus comandos use: ${prefix}commands`, type: "PLAYING" },
        { name: "🐦 Me siga no Twitter: @FoxyDiscordBot", type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
        { name: `💖 Fui criada pelo WinG4merBR#5995`, type: "LISTENING" },
        { name: `😍 Me adicione usando ${prefix}invite`, type: "WATCHING" },
        { name: `✨ Entre no meu servidor de suporte usando ${prefix}help`, type: "STREAMING", url: "https://www.twitch.tv/wing4merbr" },
        { name: `🐛 Se você encontrou um bug use ${prefix}report para reportar falhas`, type: "PLAYING" },
        { name: `🍰 Minha comida preferida é bolo 💖`, type: "WATCHING" },
        { name: "❤ A Shiro é minha amiguinha OwO", type: "WATCHING"},
        { name: `😍 Espalhando alegria e felicidade em ${client.guilds.cache.size} Servidores! :3`}
    ];

    setInterval(() => {
        let randomStatus = status[Math.floor(Math.random() * status.length)];
        client.user.setPresence({ activity: randomStatus });
    }, 10000);
}