import { ActivityTypes, editBotStatus } from "discordeno";
import { bot } from "../index";

const startActivitiesChange = async (): Promise<void> => {
    if (bot.isProduction) {
        const presences = [
            { name: "foxybot.win/add", type: ActivityTypes.Game, createdAt: Date.now() }
        ]
        const randomStatus = presences[Math.floor(Math.random() * presences.length)];
        editBotStatus(bot, {
            status: "online", activities: [randomStatus]
        });
    } else {
        editBotStatus(bot, { status: "dnd", activities: [] })
    }
}

export { startActivitiesChange }