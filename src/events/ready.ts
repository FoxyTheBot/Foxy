import { AutoPoster } from 'topgg-autoposter'

export default class Ready {
    private client: any;

    constructor(client) {
        this.client = client;
    }

    async run(): Promise<void> {
        console.info(`[READY] - Shard ${Number(this.client.shard.ids) + 1} is ready to go!`);

        const status = [
            { name: "🐦 | Me siga no Twitter: @FoxyDiscordBot", type: 0 },
            { name: `😍 | Me adicione clicando no meu perfil`, type: 1 },
            { name: `🤔 | Precisa de ajuda? Utilize /help`, type: 2 },
            { name: "🍰 | Minha comida preferida é bolo :3 💖", type: 5 },
            { name: `🐱 | Em ${this.client.guilds.cache.size} servidores`, type: "STREAMING", url: "https://twitch.tv/wing4merbr" }
        ];

        setInterval(() => {
            const randomStatus = status[Math.floor(Math.random() * status.length)];
            this.client.user.setPresence({ activities: [randomStatus] });
        }, 10000);

        // If your bot is in top.gg, you can uncomment this

        // setInterval(() => {
        //     const dbl = AutoPoster(this.client.config.dblauth, this.client);
        //     dbl.on('posted', (stats) => {
        //         this.client.WebhookManager.sendLog(stats);
        //     });
        // }, 600000);
    }
}