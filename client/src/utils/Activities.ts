import { ActivityTypes, editBotStatus } from "discordeno";
import { bot } from "../index";

const startActivities = async (): Promise<void> => {
    if (bot.isProduction) {
        const activities = [{
            name: "foxybot.win/add",
            type: ActivityTypes.Game,
            createdAt: Date.now()
        }];

        setInterval(() => {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            editBotStatus(bot, {
                status: "online", activities: [activity]
            });
        }, 3000);
    } else {
        editBotStatus(bot, {
            status: "dnd", activities: [{
                name: "metal pipe falling",
                type: ActivityTypes.Listening,
                createdAt: Date.now()
            }]
        })
    }
}

export { startActivities }