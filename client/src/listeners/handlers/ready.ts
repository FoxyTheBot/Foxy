import { logger } from "../../utils/logger"
import { postInfo } from "../../utils/dbl";
import { bot } from "../../index";
import { ActivityTypes } from "discordeno/types";

const setReadyEvent = (): void => {
    bot.events.ready = async (_, payload) => {
        logger.info(`[READY] Shard ${payload.shardId + 1} connected to Discord Gateway`);
        if (!bot.isProduction) {
            bot.helpers.editBotStatus({
                activities: [{
                    name: "I bless the rains down in Africa 🎶",
                    type: ActivityTypes.Game,
                    createdAt: Date.now(),
                }],

                status: "dnd",
            });
        } else {
            postInfo({
                guilds: await bot.database.getAllGuilds(),
            });
        }
    }
}

export { setReadyEvent }