import { ActivityTypes, editBotStatus } from "discordeno";
import { bot } from "../index";

const startActivities = async (): Promise<void> => {
    if (bot.isProduction) {
        if (!bot.isReady) {
            editBotStatus(bot, {
                status: "dnd", activities: [{
                    name: "Foxy is starting...",
                    createdAt: Date.now(),
                    type: ActivityTypes.Game
                }]
            })
        }
        editBotStatus(bot, {
            status: "online", activities: [{
                name: "foxybot.win/add",
                type: ActivityTypes.Game,
                createdAt: Date.now()
            }]
        });
    } else {
        editBotStatus(bot, { status: "dnd", activities: [] })
    }
}

export { startActivities }