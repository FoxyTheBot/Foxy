import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { createActionRow, createButton } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { getPlayerInfo, getPlayerBadges, getIdFromUsername } from "noblox.js";
import moment from "moment";
import { bot } from "../..";

const RobloxCommand = createCommand({
    name: "roblox",
    description: "[Utils] Commands related to Roblox",
    descriptionLocalizations: {
        "pt-BR": "[Utilitários] Comandos relacionados ao Roblox"
    },
    category: "util",
    options: [{
        name: "user",
        nameLocalizations: {
            "pt-BR": "usuário"
        },
        description: "[Utils] get information about a user",
        descriptionLocalizations: {
            "pt-BR": "[Utilitários] Obtenha informações sobre um usuário"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "username",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "The username of the Roblox account",
            descriptionLocalizations: {
                "pt-BR": "Nome de usuário da conta do Roblox"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }]
    }],
    execute: async (context, endCommand, t) => {
        const username = context.getOption("username", false);
        context.sendDefer();
        getIdFromUsername(String(username)).then((id) => {
            if (id) {
                getPlayerInfo(id).then((info) => {
                    getPlayerBadges(id).then((badges) => {
                        const embed = createEmbed({
                            title: context.getEmojiById(bot.emotes.ROBLOX) + " " + t("commands:roblox.title", { user: info.username}),
                            color: 0x2F3136,
                            description: info.blurb,
                            thumbnail: {
                                url: `https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`
                            },
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

                        endCommand();
                    });
                })
            }
        })
    }
});

export default RobloxCommand;