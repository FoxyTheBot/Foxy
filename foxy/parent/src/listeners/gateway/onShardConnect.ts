import { logger } from "../../../../../common/utils/logger";
import { bot } from "../../FoxyLauncher"

const onShardConnect = (): void => {
    bot.gateway.manager.createShardOptions.events.connected = async (shard) => {
        logger.info(`[SHARD] Shard #${shard.id} connected`);
        logger.onShardConnect(shard);
    }
}

export { onShardConnect }