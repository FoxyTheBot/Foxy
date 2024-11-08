import { ShardState } from "discordeno/gateway";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";

export default class PingExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const botReply = await context.sendMessageToChannel({ content: "Pinging..." });
        const ping = botReply.timestamp - context.message.timestamp;

        const currentShard = context.getRawShard();
        const shardArray = bot.gateway.manager.shards;
        const currentShardData = shardArray.find((shard) => shard.id === currentShard);
        const currentShardRtt = currentShardData?.heart.rtt ? `${currentShardData.heart.rtt}ms` : "N/A";

        if (["detailed", "shards"].includes(await context.getMessage(1))) {
            const shards = shardArray.map((shard) => {
                const shardEmote = bot.emotes[ShardState[shard.state].toUpperCase()] || bot.emotes['OFFLINE'];
                const rtt = shard.heart.rtt ? `${shard.heart.rtt}ms` : "N/A";

                return {
                    name: `Shard ${shard.id + 1}`,
                    value: context.makeReply(shardEmote, `${ShardState[shard.state]} \n💓 **|** Ping **${rtt}**`),
                    inline: true,
                };
            });

            const MAX_FIELDS_PER_EMBED = 25;
            const embeds = [];
            for (let i = 0; i < shards.length; i += MAX_FIELDS_PER_EMBED) {
                embeds.push({
                    title: "Shards",
                    description: "Veja o estado e a latência de todas as shards da Foxy.",
                    fields: shards.slice(i, i + MAX_FIELDS_PER_EMBED),
                    footer: {
                        text: `Shard: ${context.currentShard} | Your Latency: ${ping}ms`
                    },
                });
            }

            return context.editMessage({
                content: null,
                embeds: embeds,
            }, botReply.id);
        } else {
            await context.editMessage({
                content: `🏓 **|** Pong! \n` +
                    `⌚ **|** Message Latency: \`${ping}ms\`\n` +
                    `💫 **|** Gateway Latency: \`${currentShardRtt}\`\n` +
                    `💓 **|** Shard ${context.currentShard}`,
            }, botReply.id);
        }

        return endCommand();
    }
}