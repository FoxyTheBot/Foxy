import { startActivitiesChange } from "../utils/Presences";
import { logger } from "../utils/logger"
import { bot } from "../index";
import { AutoPoster } from 'topgg-autoposter'
import config from "../../config.json";

module.exports = async (_, payload) => {
    logger.success("Connected to Discord Gateway");
    startActivitiesChange();

    // If your bot is in top.gg, you can uncomment this

    setInterval(() => {
        AutoPoster(config.dblauth, bot);
    }, 7200000);
}