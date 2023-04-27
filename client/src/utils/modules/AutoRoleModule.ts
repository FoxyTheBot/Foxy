import { BotWithCache } from "discordeno/cache-plugin";
import { FoxyClient } from "../../structures/types/foxy";
import { logger } from "../logger";

export default class AutoRoleModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async start() {
        logger.info("[MODULES] AutoRoleModule started!")
        this.bot.events.guildMemberAdd = async (_, member) => {
            const guildId = member.guildId;
            const guildInfo = await this.bot.database.getGuild(guildId);
            if (!this.bot.hasGuildPermission(this.bot as BotWithCache<FoxyClient>, guildId, ["MANAGE_ROLES"] || ["ADMINISTRATOR"])) return;
            if (guildInfo.AutoRoleModule.isEnabled) {
                
                const roles = guildInfo.AutoRoleModule.roles;
                if (roles.length > 0) {
                    for (const role of roles) {
                        try {
                            setTimeout(async () => {
                                await this.bot.helpers.addRole(guildId, member.id, role, "Auto Role");
                            }, 2000);
                        } catch (error) { }
                    }
                }
            }
        }
    }
}