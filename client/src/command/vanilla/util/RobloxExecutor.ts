import { createEmbed } from "../../../utils/discord/Embed";
import { createActionRow, createButton } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import { getPlayerInfo, getPlayerBadges, getIdFromUsername, getPlayerThumbnail } from "noblox.js";
import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { DiscordTimestamp } from "../../../structures/types/DiscordTimestamps";

export default async function RobloxExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const username = context.getOption("username", false);
    context.sendDefer();

    try {
        const id = await getIdFromUsername(String(username));
        if (!id) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:roblox.fields.errors.userNotFound'))
            });
            return endCommand();
        }

        const [info, thumbnail, skin, badges] = await Promise.all([
            getPlayerInfo(id),
            getPlayerThumbnail(id, "420x420", "png", false, "headshot"),
            getPlayerThumbnail(id, "250x250", "png", false, "body"),
            getPlayerBadges(id)
        ]);

        const embed = createEmbed({
            title: context.getEmojiById(bot.emotes.ROBLOX) + " " + t("commands:roblox.title", { user: info.username }),
            color: bot.colors.RED,
            description: info.blurb,
            thumbnail: { url: thumbnail[0].imageUrl },
            image: { url: skin[0].imageUrl },
            fields: [
                { name: t("commands:roblox.fields.id"), value: `${id}`, inline: true },
                { name: t("commands:roblox.fields.joinDate"), value: context.convertToDiscordTimestamp(info.joinDate, DiscordTimestamp.LONG_AND_RELATIVE), inline: true },
                { name: t("commands:roblox.fields.username"), value: `${info.username}`, inline: true },
                { name: t("commands:roblox.fields.isBanned"), value: `${info.isBanned ? t("commands:roblox.fields.status.banned") : t("commands:roblox.fields.status.notBanned")}`, inline: true },
                { name: t("commands:roblox.fields.badges"), value: `${badges.length}`, inline: true },
                { name: t('commands:roblox.fields.nickname'), value: `${info.displayName}`, inline: true },
                { name: t('commands:roblox.fields.followers'), value: `${info.followerCount}`, inline: true },
                { name: t('commands:roblox.fields.following'), value: `${info.followingCount}`, inline: true },
                { name: t('commands:roblox.fields.friends'), value: `${info.friendCount}`, inline: true }
            ],
            url: `https://www.roblox.com/users/${id}/profile`
        });

        context.sendReply({
            embeds: [embed],
            components: [createActionRow([createButton({
                label: t("commands:roblox.buttons.viewProfile"),
                emoji: { id: BigInt(bot.emotes.ROBLOX) },
                style: ButtonStyles.Link,
                url: `https://www.roblox.com/users/${id}/profile`
            })])]
        });

    } catch (error) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:roblox.fields.errors.apiError'))
        });
    }

    endCommand();
}