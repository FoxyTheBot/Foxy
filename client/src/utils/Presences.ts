import { ActivityTypes, editBotStatus } from "discordeno";
import { bot } from "../index";

const startActivitiesChange = async (): Promise<void> => {
    const presences = [
        { name: "😘 I'm back bitches", type: ActivityTypes.Game, createdAt: Date.now() },
        { name: "🤔 | Need help? Use /help to get help", type: ActivityTypes.Game, createdAt: Date.now() },
        { name: "🦊 | Add me in your server", type: ActivityTypes.Streaming, createdAt: Date.now() },
        { name: "❤ | Help me by voting on top.gg /upvote", type: ActivityTypes.Game, createdAt: Date.now() }
    ]

    setInterval(() => {
        const randomStatus = presences[Math.floor(Math.random() * presences.length)];
        editBotStatus(bot, {
            status: "online", activities: [randomStatus]
        });
    }, 10000);
}

export { startActivitiesChange }