import { FoxyClient } from "../../structures/types/foxy";

export default class AutoRoleModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async start() {
        this.bot.events.guildMemberAdd = async (_, member) => {
            const guildId = member.guildId;
            const guildInfo = await this.bot.database.getGuild(guildId);

            if (guildInfo.AutoRoleModule.isEnabled) {
                const roles = guildInfo.AutoRoleModule.roles;
                if (roles.length > 0) {
                    for (const role of roles) {
                        try {
                            await this.bot.helpers.addRole(guildId, member.user.id, role);
                        } catch (error) { }
                    }
                }
            }
        }
    }
}