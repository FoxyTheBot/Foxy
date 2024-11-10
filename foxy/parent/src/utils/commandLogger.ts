import { User } from "discordeno/transformers";
import { bot } from "../FoxyLauncher";

const commandLogger = {
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
                        value: `${author.username} (${author.id})`
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

export { commandLogger };