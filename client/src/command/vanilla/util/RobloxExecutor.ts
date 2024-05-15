import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { createEmbed } from "../../../utils/discord/Embed";
import { createActionRow, createButton } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import { getPlayerInfo, getPlayerBadges, getIdFromUsername } from "noblox.js";
import { bot } from "../../../FoxyLauncher";
import { MessageFlags } from "../../../utils/discord/Message";

export default async function RobloxExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const username = context.getOption("username", false);
    context.sendDefer();
    getIdFromUsername(String(username)).then((id) => {
        if (id) {
            getPlayerInfo(id).then((info) => {
                getPlayerBadges(id).then((badges) => {
                    const embed = createEmbed({
                        title: context.getEmojiById(bot.emotes.ROBLOX) + " " + t("commands:roblox.title", { user: info.username }),
                        color: 0xff0000,
                        description: info.blurb,
                        fields: [{
                            name: t("commands:roblox.fields.id"),
                            value: `${id}`,
                            inline: true
                        },
                        {
                            name: t("commands:roblox.fields.joinDate"),
                            value: context.toDiscordTimestamp(info.joinDate),
                            inline: true
                        },
                        {
                            name: t("commands:roblox.fields.username"),
                            value: `${info.username}`,
                            inline: true
                        },
                        {
                            name: t("commands:roblox.fields.isBanned"),
                            value: `${info.isBanned ? t("commands:roblox.fields.status.banned") : t("commands:roblox.fields.status.notBanned")}`,
                            inline: true
                        },
                        {
                            name: t("commands:roblox.fields.badges"),
                            value: `${badges.length}`,
                            inline: true
                        },
                        {
                            name: t('commands:roblox.fields.nickname'),
                            value: `${info.displayName}`,
                            inline: true
                        },
                        {
                            name: t('commands:roblox.fields.followers'),
                            value: `${info.followerCount}`,
                            inline: true
                        },
                        {
                            name: t('commands:roblox.fields.following'),
                            value: `${info.followingCount}`,
                            inline: true
                        },
                        {
                            name: t('commands:roblox.fields.friends'),
                            value: `${info.friendCount}`,
                            inline: true
                        }],
                        url: `https://www.roblox.com/users/${id}/profile`
                    })

                    context.sendReply({
                        embeds: [embed],
                        components: [createActionRow([createButton({
                            label: t("commands:roblox.buttons.viewProfile"),
                            emoji: {
                                id: bot.emotes.ROBLOX
                            },
                            style: ButtonStyles.Link,
                            url: `https://www.roblox.com/users/${id}/profile`
                        })])]
                    });

                    return endCommand();
                });
            })
        }
    }).catch((err) => {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:roblox.errors.userNotFound')),
            flags: MessageFlags.EPHEMERAL
        });
        return endCommand();
    })
}