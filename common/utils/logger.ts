import { ShardState } from "discordeno/gateway";
import { bot } from "../../foxy/parent/src/FoxyLauncher";

const logger = {
    error: (...args: any[]): void => {
        console.error(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[31mERROR\u001b[0m >`, ...args);
    },

    info: (...args: any[]): void => {
        console.info(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[94mINFO\u001b[0m >`, ...args);
    },

    warn: (...args: any[]): void => {
        console.warn(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[33mWARN\u001b[0m >`, ...args);
    },

    debug: (...args: any[]): void => {
        console.debug(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[36mDEBUG\u001b[0m >`, ...args);
    },

    criticalError: (...args: any[]): void => {
        console.error(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[91mCRITICAL ERROR\u001b[0m >`, ...args);
    },

    log: (...args: any[]): void => {
        console.log(...args);
    },

    /* Shard related */

    onShardConnecting: (shard): void => {
        setTimeout(() => {
            bot.helpers.sendWebhookMessage(process.env.WATCHDOG_WEBHOOK_ID, process.env.WATCHDOG_WEBHOOK_TOKEN, {
                embeds: [{
                    title: `🔗 | Shard #${shard.id} está tentando se conectar...`
                }]
            });
        }, 1000);
    },

    onShardConnect: (shard): void => {
        setTimeout(() => {
            bot.helpers.sendWebhookMessage(process.env.WATCHDOG_WEBHOOK_ID, process.env.WATCHDOG_WEBHOOK_TOKEN, {
                embeds: [{
                    title: `🔗 | Shard #${shard.id} conectada`
                }]
            });
        }, 1000);
    },

    onShardDisconnect: (shard): void => {
        setTimeout(() => {
            bot.helpers.sendWebhookMessage(process.env.WATCHDOG_WEBHOOK_ID, process.env.WATCHDOG_WEBHOOK_TOKEN, {
                embeds: [{
                    title: `🔗 | Shard #${shard.id} desconectada`
                }]
            });
        }, 1000);
    },

    onShardReconnect: (shard): void => {
        setTimeout(() => {
            bot.helpers.sendWebhookMessage(process.env.WATCHDOG_WEBHOOK_ID, process.env.WATCHDOG_WEBHOOK_TOKEN, {
                embeds: [{
                    title: `🔗 | Tentando reconectar shard #${shard.id}...`,
                    fields: [{
                        name: "Razão da desconexão",
                        value: ShardState[shard.state]
                    }]
                }]
            })
        }, 1000);
    },

    onShardReady: (shard, guilds): void => {
        setTimeout(() => {
            bot.helpers.sendWebhookMessage(process.env.WATCHDOG_WEBHOOK_ID, process.env.WATCHDOG_WEBHOOK_TOKEN, {
                embeds: [{
                    title: `🔗 | Shard ${shard + 1} está pronta com ${guilds} servidores!`
                }]
            });
        }, 1000);
    }
}

export { logger };