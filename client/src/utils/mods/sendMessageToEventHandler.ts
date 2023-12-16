import { Bot, DiscordUnavailableGuild } from "discordeno/*";

export default async function sendMessageToEventHandler(bot: Bot, message: any, shardId: number) {
    if (message.t === "GUILD_DELETE" && (message.d as DiscordUnavailableGuild).unavailable) return;

    await bot.handlers[message.t]?.(bot, message, shardId)
}