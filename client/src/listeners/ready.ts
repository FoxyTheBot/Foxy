import { logger } from "../utils/logger"
import { postInfo } from "../utils/dbl";
import { bot } from "../FoxyLauncher";
import { ActivityTypes } from "discordeno/types";

const setReadyEvent = (): void => {
    bot.events.ready = async (_, payload) => {
        logger.info(`[READY] Shard ${payload.shardId + 1} connected to Discord Gateway`);
        if (bot.isProduction) {
            postInfo({
                guilds: await bot.database.getAllGuilds(),
            });
        }

        bot.helpers.editBotStatus({
            activities: [{
                name: bot.isProduction ?
                    "Precisa de ajuda? Entre no meu servidor de suporte foxybot.win/br/support"
                    : "I bless the rains down in Africa 🎶",
                type: ActivityTypes.Game,
                createdAt: Date.now(),
            }],

            status: "dnd",
        });
    }
}

export { setReadyEvent }