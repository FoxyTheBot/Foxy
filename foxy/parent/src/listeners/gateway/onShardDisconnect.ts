import { logger } from "../../../../../common/utils/logger"
import { bot } from "../../FoxyLauncher"

const onShardDisconnect = async (): Promise<void> => {
    bot.gateway.manager.createShardOptions.events.disconnected = async (shard) => {
        logger.error(`[SHARD] Shard ${shard.id + 1} disconnected!`);
        logger.onShardDisconnect(shard);
        try {
            setTimeout(async () => {
                logger.info(`[SHARD] Trying to reconnect shard ${shard.id + 1}...`);
                logger.onShardReconnect(shard);
                await shard.resume();
                await shard.startHeartbeating(60000);
            }, 5000); // 5 seconds
        } catch (error) {
            logger.error(`[SHARD] Shard ${shard.id + 1} failed to reconnect.`, error);
        }
    }
}

export { onShardDisconnect }