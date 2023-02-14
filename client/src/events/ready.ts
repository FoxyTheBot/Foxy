import { startActivitiesChange } from "../utils/Presences";
import { logger } from "../utils/logger"
import { postInfo } from "../utils/dbl";

module.exports = async (_, payload) => {
    logger.success("Connected to Discord Gateway");
    startActivitiesChange();
    postInfo();
}