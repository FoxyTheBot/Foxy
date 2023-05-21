import { Member, User } from "discordeno/transformers";
import { FoxyClient } from "../../structures/types/foxy";
import { BigString } from "discordeno/types";
import { CreateMessage } from "discordeno/*";

export default class WelcomeModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async checkMemberAdd(member: Member) {
        const guildId = member.guildId;
        const guildInfo = await this.bot.database.getGuild(guildId);
        const guildInfoFromAPI = await this.bot.helpers.getGuild(guildId);

        if (await guildInfo.WelcomeModule.isEnabled) {
            if (!this.bot.hasGuildPermission(this.bot, guildId, ["MANAGE_MESSAGES"] || ["ADMINISTRATOR"])) return;

            const welcomeChannel = await guildInfo.WelcomeModule.joinChannel;
            const welcomeMessage: CreateMessage = await guildInfo.WelcomeModule.message ?? {
                content: `👉 Welcome {user} to {guild}!`,
                embed: []
            };

            if (welcomeMessage.content.includes("{user}")) {
                welcomeMessage.content = welcomeMessage.content.replace("{user}", `${member.user.username}`);
            };
            if (welcomeMessage.content.includes("{guild}")) {
                welcomeMessage.content = welcomeMessage.content.replace("{guild}", `${guildInfoFromAPI.name}`);
            };
            if (welcomeMessage.content.includes("{counter}")) {
                welcomeMessage.content = welcomeMessage.content.replace("{counter}", `${guildInfoFromAPI.memberCount}`);
            }
            if (welcomeMessage.content.includes("{@user}")) {
                welcomeMessage.content = welcomeMessage.content.replace("{@user}", `<@${member.user.id}>`);
            }

            console.log(welcomeChannel, welcomeMessage)
            if (welcomeChannel) {
                try {
                    setTimeout(async () => {
                        await this.bot.helpers.sendMessage(welcomeChannel, welcomeMessage);
                    }, 500);
                } catch (error) {
                    return;
                }
            } else {
                return;
            }

            if (await guildInfo.WelcomeModule.sendDm) {
                const dmMessage: CreateMessage = await guildInfo.WelcomeModule.dmMessage ?? {
                    content: `👉 Welcome {user} to {guild}!`,
                    embed: []
                }

                if (dmMessage.content.includes("{user}")) {
                    dmMessage.content = dmMessage.content.replace("{user}", `${member.user.username}`);
                }
                if (dmMessage.content.includes("{guild}")) {
                    dmMessage.content = dmMessage.content.replace("{guild}", `${guildInfoFromAPI.name}`);
                }
                if (dmMessage.content.includes("{counter}")) {
                    dmMessage.content = dmMessage.content.replace("{counter}", `${guildInfoFromAPI.memberCount}`);
                }
                if (dmMessage.content.includes("{@user}")) {
                    dmMessage.content = dmMessage.content.replace("{@user}", `<@${member.user.id}>`);
                }

                try {
                    setTimeout(async () => {
                        await this.bot.foxyRest.sendDirectMessage(member.user.id.toString(), {
                            content: `> **WARNING!** The message below has been configured by the \`${guildInfoFromAPI.name} / ${guildInfoFromAPI.id}\` server team! If you see any explicit content, please report it to the bot owner in the support server! <https://foxybot.win/support>`
                        })
                    }, 700);

                    setTimeout(async () => {
                        await this.bot.foxyRest.sendDirectMessage(member.user.id.toString(), dmMessage);
                    }, 800);
                } catch (error) {
                    return;
                }
            }
        }
    }
    async checkMemberRemove(member: User, guildId: BigString) {
        const guildInfo = await this.bot.database.getGuild(guildId);
        const guildInfoFromAPI = await this.bot.helpers.getGuild(guildId);

        if (await guildInfo.WelcomeModule.isLeaveMessageEnabled) {
            if (!this.bot.hasGuildPermission(this.bot, BigInt(guildId), ["MANAGE_MESSAGES"] || ["ADMINISTRATOR"])) return;

            const leaveChannel = await guildInfo.WelcomeModule.leaveChannel;
            const leaveMessage: CreateMessage = await guildInfo.WelcomeModule.leaveMessage ?? {
                content: `👉 {user} left {guild}!`,
                embed: []
            };

            if (leaveMessage.content.includes("{user}")) {
                leaveMessage.content = leaveMessage.content.replace("{user}", `${member.username}`);
            };
            if (leaveMessage.content.includes("{guild}")) {
                leaveMessage.content = leaveMessage.content.replace("{guild}", `${guildInfoFromAPI.name}`);
            };
            if (leaveMessage.content.includes("{counter}")) {
                leaveMessage.content = leaveMessage.content.replace("{counter}", `${guildInfoFromAPI.memberCount}`);
            }
            if (leaveMessage.content.includes("{@user}")) {
                leaveMessage.content = leaveMessage.content.replace("{@user}", `<@${member.id}>`);
            }

            if (leaveChannel) {
                try {
                    setTimeout(async () => {
                        await this.bot.helpers.sendMessage(leaveChannel, leaveMessage);
                    }, 500);
                } catch (error) {
                    return;
                }
            } else {
                return;
            }
        }
    }
}