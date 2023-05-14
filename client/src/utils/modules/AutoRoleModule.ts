import { FoxyClient } from "../../structures/types/foxy";

export default class AutoRoleModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async check(member) {
        const guildId = member.guildId;
        const guildInfo = await this.bot.database.getGuild(guildId);
        if (!this.bot.hasGuildPermission(this.bot, guildId, ["MANAGE_ROLES"] || ["ADMINISTRATOR"])) return;
        if (guildInfo.AutoRoleModule.isEnabled) {
            if (member.user.toggles.bot) return;

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