import { logger } from "../../../../../common/utils/logger"
import { bot } from "../../FoxyLauncher"

const onShardConnecting = (): void => {
    bot.gateway.manager.createShardOptions.events.connecting = async (shard) => {
        logger.info(`[SHARD] Shard ${shard.id + 1} is trying to connect...`);
        logger.onShardConnecting(shard);
    }
}

export { onShardConnecting }