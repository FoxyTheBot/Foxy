import { logger } from "../../../../../common/utils/logger";
import { FoxyClient } from "../../structures/types/FoxyClient";

export default class DebugUtils {
    private bot: FoxyClient;

    constructor(bot: FoxyClient) {
        this.bot = bot;

        this.startExtraListeners();
    }

    startExtraListeners(): void {
        logger.warn(`[DEBUG] Starting extra listeners...`);

        this.bot.gateway.manager.createShardOptions.events.identifying = async (shard) => {
            logger.debug(`[SHARD] Shard #${shard.id} is identifying...`);
        }

        this.bot.gateway.manager.createShardOptions.events.hello = async (shard) => {
            logger.debug(`[SHARD] Shard #${shard.id} received hello packet!`);
        }

        this.bot.gateway.manager.createShardOptions.events.heartbeatAck = async (shard) => {
            logger.debug(`[SHARD] Shard #${shard.id} received heartbeat ack!`);
        }

        this.bot.gateway.manager.createShardOptions.events.identified = async (shard) => {
            logger.debug(`[SHARD] Shard #${shard.id} identified!`);
        }

        this.bot.gateway.manager.createShardOptions.events.resuming = async (shard) => {
            logger.debug(`[SHARD] Shard #${shard.id} is resuming...`);
        }

        this.bot.gateway.manager.createShardOptions.events.resumed = async (shard) => {
            logger.debug(`[SHARD] Shard #${shard.id} resumed!`);
        }

        this.bot.gateway.manager.createShardOptions.events.invalidSession = async (shard, invalid) => {
            logger.error(`[SHARD] Shard #${shard.id} received invalid session!`);
        }
    }
}