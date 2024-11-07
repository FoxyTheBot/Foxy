import { logger } from "../../../../../common/utils/logger"
import { bot } from "../../FoxyLauncher"

const onRequestedConnect = (): void => {
    bot.gateway.manager.createShardOptions.events.requestedReconnect = async (shard) => {
        logger.warn(`[SHARD] Shard #${shard.id} requested a reconnect`);
    }
}

export { onRequestedConnect }