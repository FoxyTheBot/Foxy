import { ActivityTypes, editBotStatus } from "discordeno";
import { bot } from "../index";

const startActivities = async (): Promise<void> => {
    if (bot.isProduction) {
        const activities = [{
            name: "Add me in your server! foxybot.win/add",
            type: ActivityTypes.Game,
            createdAt: Date.now()
        },
        {
            name: "💖 My 3 years are coming!",
            type: ActivityTypes.Game,
            createdAt: Date.now()
        },
        {
            name: "🎂 It's my birthday month!",
            type: ActivityTypes.Game,
            createdAt: Date.now()
        },
        {
            name: "🎉 Since 2020 spreading joy and fun",
            type: ActivityTypes.Game,
            createdAt: Date.now()
        },
        {
            name: "😊 Join in my support server! foxybot.win/discord :3",
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