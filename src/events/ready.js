
module.exports = async(client, message) => {

    let activities = [
            `❓ Use f!help para obter ajuda`,
            `📷 Avatar por: Bis❄`,
            `😍 Espalhando alegria em ${client.guilds.cache.size} servidores [Shard: ${client.shard.ids}]`,
            `😎 Eu sou open-source https://github.com/BotFoxy ＼(^o^)／`,
            `💻 Use f!commands para ver minha lista de comandos`,
            `😍 Tornando seu servidor extraordinário ᕕ(ᐛ)ᕗ`,
            `🐦 Me siga no Twitter @FoxyDiscordBot`,
            `Me ajude a ficar online doando para mim ❤ Use f!donate :D`,
            `🦊 What Does The Fox Say?`

        ],

        i = 0;
    setInterval(() => client.user.setActivity(`${activities[i++ %
    activities.length]}`,{
        type: "WATCHING"
    }), 5000);

    console.log(`[CONNECTION SUCCESSFULLY] - Guilds ${client.guilds.cache.size}`)

}