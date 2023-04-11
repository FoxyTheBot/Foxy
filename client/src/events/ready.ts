import { startActivities } from "../utils/Activities";
import { logger } from "../utils/logger"
import { postInfo } from "../utils/dbl";
import { bot } from "../index";

module.exports = (_, payload) => {
    logger.info(`[READY] Shard ${payload.shardId + 1} connected to Discord Gateway`);
    if (bot.isProduction) {
        postInfo();
    }
    startActivities();
    bot.isReady = true;
}