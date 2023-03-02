import { startActivitiesChange } from "../utils/Presences";
import { logger } from "../utils/logger"
import { postInfo } from "../utils/dbl";
import { bot } from "../index";

module.exports = async (_, payload) => {
    logger.info("[READY] Connected to Discord Gateway");
    if (bot.isProduction) {
        postInfo();
    }
    startActivitiesChange();
    bot.isReady = true;
}