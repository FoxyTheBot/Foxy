import { logger } from "../../utils/logger"
import { postInfo } from "../../utils/dbl";
import { bot } from "../../index";
import { startActivities } from "../../utils/Activities";

const setReadyEvent = (): void => {
    bot.events.ready = async (_, payload) => {
        logger.info(`[READY] Shard ${payload.shardId + 1} connected to Discord Gateway`);
        startActivities();
        if (bot.isProduction) {
            postInfo({
                guilds: (await bot.foxyRest.getBotGuilds()).length,
            });
        }
    }
}

export { setReadyEvent }