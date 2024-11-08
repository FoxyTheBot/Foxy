import { logger } from "../../../../common/utils/logger"
import { bot } from "../FoxyLauncher";
import { ActivityTypes } from "discordeno/types";

const setReadyEvent = (): void => {
    bot.events.ready = async (_, payload) => {
        logger.info(`[READY] Shard #${payload.shardId} is ready with ${payload.guilds.length} guilds!`);

        await bot.helpers.editShardStatus(payload.shardId, {
            activities: [{
                name: `Precisa de ajuda? Entre no meu servidor de suporte foxybot.win/br/support | Shard ${payload.shardId + 1}/${bot.gateway.calculateTotalShards}`,
                type: ActivityTypes.Game,
                createdAt: Date.now(),
            }],

            status: "online",
        });
    }
}

export { setReadyEvent }