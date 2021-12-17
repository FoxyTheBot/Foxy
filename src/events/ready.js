module.exports = class Ready {
    constructor(client) {
        this.client = client;
    }

    async run() {
        console.info(`\x1b[37m\x1b[42mSUCCESS\x1b[0m: Shard ${Number(this.client.shard.ids) + 1} Está conectada com ${this.client.guilds.cache.size} Servidores!`);

        const status = [
            { name: "🐦 | Me siga no Twitter: @FoxyDiscordBot", type: "STREAMING", url: "https://www.twitch.tv/wing4merbr1" },
            { name: "💖 | Fui criada pelo WinG4merBR#6611", type: "LISTENING" },
            { name: `😍 | Me adicione usando /invite`, type: "WATCHING" },
            { name: `🤔 | Precisa de ajuda? Utilize /help`, type: "STREAMING", url: "https://www.twitch.tv/wing4merbr1" },
            { name: "🍰 | Minha comida preferida é bolo 💖", type: 5 },
        ];

        setInterval(() => {
            const randomStatus = status[Math.floor(Math.random() * status.length)];
            this.client.user.setPresence({ activities: [randomStatus] });
        }, 5000);
    }
}