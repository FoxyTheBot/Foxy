import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from '@discordjs/builders';

export default class PingCommand extends Command {
    public client: any;

    constructor(client) {
        super(client, {
            name: "ping",
            description: "Veja a latência da Foxy",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("ping")
                .setDescription("[🛠 Utils] Veja a latência da Foxy")
        })
    }

    async execute(interaction) {
        interaction.editReply(`:ping_pong: **| Pong!** \n:watch: **| Gateway Ping:** \`${Math.round(this.client.ws.ping)}ms\` \n:zap: **| API Ping:** \`${Date.now() - interaction.createdTimestamp}ms\` \n${this.client.emotes.foxyhi} **| Shard:** \`${Number(this.client.shard.ids) + 1}/${this.client.shard.count}\``);
    }
}