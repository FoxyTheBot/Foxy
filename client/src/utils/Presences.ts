import { ActivityTypes, editBotStatus } from "discordeno";
import { bot } from "../index";

const startActivitiesChange = async (): Promise<void> => {
    if (bot.isProduction) {
        const presences = [
            { name: "https://foxybot.win/add", type: ActivityTypes.Game, createdAt: Date.now() }
        ]

        setInterval(() => {
            const randomStatus = presences[Math.floor(Math.random() * presences.length)];
            editBotStatus(bot, {
                status: "online", activities: [randomStatus]
            });
        }, 10000);
    } else {
        editBotStatus(bot, { status: "dnd", activities: [] })
    }
}

export { startActivitiesChange }