import { logger } from "../utils/logger"
import { postInfo } from "../utils/dbl";
import { bot } from "../FoxyLauncher";
import { ActivityTypes } from "discordeno/types";

const setReadyEvent = (): void => {
    bot.events.ready = async (_, payload) => {
        logger.info(`[READY] Shard ${payload.shardId + 1} connected to Discord Gateway`);

        bot.isProduction ? postInfo({ guilds: await bot.database.getAllGuilds() })
            : logger.warn(`[DEVELOPMENT MODE] Running in development mode. Skipping Discord Bot List posting`);

        bot.helpers.editBotStatus({
            activities: [{
                name: bot.isProduction ?
                    "Precisa de ajuda? Entre no meu servidor de suporte foxybot.win/br/support"
                    : "Tactical nuke incoming!",
                type: ActivityTypes.Game,
                createdAt: Date.now(),
            }],

            status: "online",
        });
    }
}

export { setReadyEvent }