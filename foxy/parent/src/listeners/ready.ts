import { logger } from "../../../../common/utils/logger"
import { postInfo } from "../utils/dbl";
import { bot } from "../FoxyLauncher";
import { ActivityTypes } from "discordeno/types";

const setReadyEvent = (): void => {
    bot.events.ready = async (_, payload) => {
        logger.info(`[READY] Shard ${payload.shardId + 1} is ready with ${payload.guilds.length} guilds!`);
        logger.onShardReady(payload.shardId, payload.guilds.length);
        bot.isProduction ? postInfo({ guilds: await bot.database.getAllGuilds() })
            : logger.warn(`[DEVELOPMENT MODE] Running in development mode. Skipping Discord Bot List posting`);

        if (bot.isProduction) {
            bot.helpers.editBotStatus({
                activities: [{
                    name: "Precisa de ajuda? Entre no meu servidor de suporte foxybot.win/br/support",
                    type: ActivityTypes.Game,
                    createdAt: Date.now(),
                }],
    
                status: "online",
            });
        }
    }
}

export { setReadyEvent }