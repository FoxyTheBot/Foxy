import { startActivities } from "../../utils/Activities";
import { logger } from "../../utils/logger"
import { postInfo } from "../../utils/dbl";
import { bot } from "../../index";

const setReadyEvent = (): void => {
    bot.events.ready = (_, payload) => {
        logger.info(`[READY] Shard ${payload.shardId + 1} connected to Discord Gateway`);
        if (bot.isProduction) {
            postInfo();
        }
        bot.isReady = true;
        startActivities();
    }
}

export { setReadyEvent }