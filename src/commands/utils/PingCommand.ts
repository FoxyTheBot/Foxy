import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from '@discordjs/builders';

export default class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Show the Foxy's Latency",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("ping")
                .setDescription("[Utils] Show the Foxy's Latency")
        })
    }

    async execute(interaction): Promise<void> {
        interaction.reply(`:ping_pong: **| Pong!** \n:watch: **| Gateway Ping:** \`${Math.round(this.client.ws.ping)}ms\` \n:zap: **| API Ping:** \`${Date.now() - interaction.createdTimestamp}ms\` \n${this.client.emotes.foxyhi} **| Shard:** \`${Number(this.client.shard.ids) + 1}/${this.client.shard.count}\``);
    }
}