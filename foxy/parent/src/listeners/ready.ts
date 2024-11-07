import { logger } from "../../../../common/utils/logger"
import { bot } from "../FoxyLauncher";
import { ActivityTypes } from "discordeno/types";

const setReadyEvent = (): void => {
    bot.events.ready = async (_, payload) => {
        logger.info(`[READY] Shard #${payload.shardId} is ready with ${payload.guilds.length} guilds!`);
        logger.onShardReady(payload.shardId, payload.guilds.length);
        
        if (bot.isProduction) {
            bot.helpers.editBotStatus({
                activities: [{
                    name: `Precisa de ajuda? Entre no meu servidor de suporte foxybot.win/br/support | Shard ${payload.shardId + 1}/${bot.gateway.calculateTotalShards}`,
                    type: ActivityTypes.Game,
                    createdAt: Date.now(),
                }],

                status: "online",
            });
        }
    }
}

export { setReadyEvent }