import { startActivitiesChange } from "../utils/Presences";
import { logger } from "../utils/logger"
import { bot } from "../index";

module.exports = async (_, payload) => {
    logger.success("Connected to Discord Gateway", ); 
    startActivitiesChange();

}