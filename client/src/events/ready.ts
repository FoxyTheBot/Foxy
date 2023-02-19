import { startActivitiesChange } from "../utils/Presences";
import { logger } from "../utils/logger"
import { postInfo } from "../utils/dbl";
import { bot } from "../index";

module.exports = async (_, payload) => {
    logger.success("Connected to Discord Gateway");
    startActivitiesChange();
    postInfo();
    bot.isReady = true;
}