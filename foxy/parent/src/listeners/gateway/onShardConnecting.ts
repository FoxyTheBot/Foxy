import { logger } from "../../../../../common/utils/logger"
import { bot } from "../../FoxyLauncher"

const onShardConnecting = (): void => {
    bot.gateway.manager.createShardOptions.events.connecting = async (shard) => {
        logger.info(`[SHARD] Shard #${shard.id} is trying to connect...`);
    }
}

export { onShardConnecting }