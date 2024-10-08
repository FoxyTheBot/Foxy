import { bot } from "../FoxyLauncher";
import { User } from "discordeno/transformers";

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

    criticalError: (...args: any[]): void => {
        console.error(`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] \u001b[91mCRITICAL ERROR\u001b[0m >`, ...args);
    },

    log: (...args: any[]): void => {
        console.log(...args);
    },

    commandLog: (command: string, author: User, guild: string, args: string): void => {
        setTimeout(async () => {
            bot.helpers.sendWebhookMessage(process.env.EVENTS_WEBHOOK_ID, process.env.EVENTS_WEBHOOK_TOKEN, {
                embeds: [{
                    title: "✨ | Comando executado",
                    fields: [{
                        name: "Comando:",
                        value: command
                    },
                    {
                        name: "Autor",
                        value: `${await author.username} (${await author.id})`
                    },
                    {
                        name: "Servidor/DM",
                        value: guild
                    },
                    {
                        name: "Argumentos",
                        value: args
                    }]
                }]
            });
        }, 600);
    }
}

export { logger };