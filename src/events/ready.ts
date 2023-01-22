import bot from "../FoxyClient";
module.exports = async (_, payload) => {
  console.info(`[SHARDS] Shard ID ${payload.shardId++} of ${bot.gateway.lastShardId + 1} shards is ready!`);

  if (payload.shardId === bot.gateway.lastShardId + 1) {
    console.info("[READY] Connected to Discord gateway!");
  }

}