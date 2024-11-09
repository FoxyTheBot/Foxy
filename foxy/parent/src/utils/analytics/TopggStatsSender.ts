import { Api, BotStats } from '@top-gg/sdk';
import cron from 'node-cron';
import { logger } from '../../../../../common/utils/logger';
import { FoxyClient } from '../../structures/types/FoxyClient';

export default class TopggStatsSender {
    private api: Api;

    constructor(dblToken: string) {
        this.api = new Api(dblToken);
    }

    async createPostStatsRoutine(bot: FoxyClient) {
        try {
            cron.schedule('0 0 * * *', async () => {
                try {
                    logger.info('[TOPGG] Posting stats to top.gg...');
                    await this.api.postStats({
                        serverCount: await bot.database.getAllGuilds(),
                        shardCount: bot.botGatewayData.shards || 1
                    });
                } catch (error) {
                    logger.error('[TOPGG] Failed to post stats: ' + error);
                }
            });
        } catch (error) {
            logger.error('[TOPGG] Failed to set up stats posting schedule: ' + error);
        }
    }
}
