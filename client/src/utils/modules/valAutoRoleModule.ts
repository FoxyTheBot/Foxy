import { Member } from "discordeno/transformers";
import { FoxyClient } from "../../structures/types/foxy";

export default class ValAutoRoleModule {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async checkUser(member: Member) {
        if (!member) return;
        const guildId = member.guildId;
        if (!this.bot.hasGuildPermission(this.bot, guildId, ["MANAGE_ROLES"] || ["ADMINISTRATOR"])) return;
        const guildInfo = await this.bot.database.getGuild(guildId);
        const userInfo = await this.bot.database.getUser(member.id);
        if (!userInfo.riotAccount.isLinked) return;
        const valUserInfo = await this.bot.foxyRest.getMMR(userInfo.riotAccount.puuid);
    
        const authorRoles = member.roles.map(role => role ? role.toString() : null);
        const valAutoRoleModuleRoles = Object.values(guildInfo.valAutoRoleModule);
    
        const cleanedAuthorRoles = authorRoles.filter(role => role !== null).map(role => role.toLowerCase().trim());
        const cleanedValAutoRoleModuleRoles = valAutoRoleModuleRoles.filter(role => role !== null && typeof role !== 'boolean').map(role => role); 
    
        const matchingRole = cleanedAuthorRoles.find(role => {
            const includes = cleanedValAutoRoleModuleRoles.includes(role);
            return includes;
        });
    
    
        const patchedTier: string = valUserInfo.data.current_data.currenttierpatched.match(/[a-zA-Z]+/)[0].toLowerCase();
        const role = guildInfo.valAutoRoleModule[patchedTier + "Role"];
    
        if (matchingRole === role || !role) return;
    
        if (!matchingRole) {
            this.bot.helpers.addRole(guildId, member.id, role);
        }
    
        if (matchingRole) {
            setTimeout(() => {
                this.bot.helpers.removeRole(guildId, member.id, matchingRole);
                this.bot.helpers.addRole(guildId, member.id, role);
            }, 5000);
        }
        return;
    }
    
}