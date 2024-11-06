import { logger } from "../../../../../common/utils/logger";
import { FoxyClient } from "../../structures/types/FoxyClient";

export default class DebugUtils {
    private bot: FoxyClient;
    private supressDefaultListeners: boolean;

    constructor(bot: FoxyClient) {
        this.bot = bot;

        new Promise(async (resolve) => {
            await this.startExtraListeners();
        });
    }

    async startExtraListeners(): Promise<void> {
        logger.warn(`[DEBUG] Starting extra listeners...`);
        this.bot.helpers.editBotStatus({
            activities: [{
                name: `Snap back to reality, oh there goes gravity!`,
                type: 0,
                createdAt: Date.now(),
            }],
            status: "dnd",
        });

        this.bot.gateway.manager.createShardOptions.events.identifying = async (shard) => {
            logger.debug(`[SHARD] Shard ${shard.id + 1} is identifying...`);
        }

        this.bot.gateway.manager.createShardOptions.events.hello = async (shard) => {
            logger.debug(`[SHARD] Shard ${shard.id + 1} received hello packet!`);
        }

        this.bot.gateway.manager.createShardOptions.events.heartbeatAck = async (shard) => {
            logger.debug(`[SHARD] Shard ${shard.id + 1} received heartbeat ack!`);
        }

        this.bot.gateway.manager.createShardOptions.events.identified = async (shard) => {
            logger.debug(`[SHARD] Shard ${shard.id + 1} identified!`);
        }

        this.bot.gateway.manager.createShardOptions.events.resuming = async (shard) => {
            logger.debug(`[SHARD] Shard ${shard.id + 1} is resuming...`);
        }

        this.bot.gateway.manager.createShardOptions.events.resumed = async (shard) => {
            logger.debug(`[SHARD] Shard ${shard.id + 1} resumed!`);
        }

        this.bot.gateway.manager.createShardOptions.events.invalidSession = async (shard, invalid) => {
            logger.debug(`[SHARD] Shard ${shard.id + 1} received invalid session!`);
        }
    }
}