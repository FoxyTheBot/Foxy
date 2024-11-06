import { ShardState } from "discordeno/gateway";
import { logger } from "../../../../../common/utils/logger";
import { bot } from "../../FoxyLauncher";

const onShardDisconnect = async (): Promise<void> => {
    bot.gateway.manager.createShardOptions.events.disconnected = async (shard) => {
        setTimeout(async () => {
            logger.error(`[SHARD] Shard ${shard.id + 1} disconnected! | Disconnection reason: ${ShardState[shard.state]}`);
            logger.onShardReconnect(shard);
            try {
                switch (shard.state) {
                    case ShardState.Disconnected:
                    case ShardState.Offline:
                        logger.info(`[SHARD] Shard ${shard.id + 1} is ${shard.state}. Attempting to connect...`);
                        await shard.connect();
                        break;
                
                    case ShardState.Unidentified:
                        logger.info(`[SHARD] Shard ${shard.id + 1} is Unidentified. Attempting to identify...`);
                        await bot.gateway.manager.requestIdentify(shard.id);
                        break;
                
                    case ShardState.Identifying:
                        logger.info(`[SHARD] Shard ${shard.id + 1} is Identifying. Attempting to resume...`);
                        await shard.resume();
                        break;
                
                    case ShardState.Resuming:
                    case ShardState.Connected:
                        logger.info(`[SHARD] Shard ${shard.id + 1} is either Resuming or Connected. No action needed.`);
                        break;
                
                    default:
                        logger.warn(`[SHARD] Shard ${shard.id + 1} is in an unknown state. Attempting to resume...`);
                        await shard.resume();
                        break;
                }
                
            } catch (error) {
                logger.error(`[SHARD] Failed to reconnect shard ${shard.id + 1}.`, error);
            }
        }, 10000);
    };
};

export { onShardDisconnect };
