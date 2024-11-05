import { logger } from "../../../../../common/utils/logger"
import { bot } from "../../FoxyLauncher"

const onShardDisconnect = async (): Promise<void> => {
    bot.gateway.manager.createShardOptions.events.disconnected = async (shard) => {
        logger.error(`[SHARD] Shard ${shard.id + 1} disconnected!`);
        try {
            logger.info(`[SHARD] Trying to reconnect shard ${shard.id + 1}...`);
            await shard.resume();
        } catch (error) {
            logger.error(`[SHARD] Shard ${shard.id + 1} failed to reconnect.`, error);
        }
    }
}

export { onShardDisconnect }