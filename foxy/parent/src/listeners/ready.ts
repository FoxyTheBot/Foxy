import { Bot } from "discordeno";
import { logger } from "../../../../common/utils/logger"

const setReadyEvent = async (_: Bot, payload): Promise<void> => {
    logger.info(`[READY] Shard #${payload.shardId} is ready with ${payload.guilds.length} guilds!`);
};

export { setReadyEvent }