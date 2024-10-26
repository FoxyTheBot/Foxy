import { FoxyRestManager } from "../../../../../common/utils/RestManager";
import DatabaseConnection from "../../../../../common/utils/database/DatabaseConnection";

export default class ValAutoRoleModule {
    public rest: FoxyRestManager;
    public database: DatabaseConnection;
    constructor() {
        this.rest = new FoxyRestManager();
        this.database = new DatabaseConnection();
    }


    async updateRole(userId, guildId) {
        const guildInfo = await this.database.getGuild(guildId);
        const userInfo = await this.database.getUser(userId);
        if (!guildInfo) return AutoroleCodes.GUILD_NOT_FOUND;
        if (!userInfo) return AutoroleCodes.USER_NOT_FOUND;
        if (!userInfo.riotAccount.isLinked) return AutoroleCodes.USER_NOT_LINKED;

        const valUserInfo = await this.rest.getMMR(userInfo.riotAccount.puuid);
        const currentTier = valUserInfo.data.current_data.currenttierpatched?.toLowerCase() || "unrated";
        const patchedTier = currentTier.match(/[a-zA-Z]+/)?.[0] ?? "unrated";
        const roleId = guildInfo.valAutoRoleModule[patchedTier + "Role"];

        if (!roleId) return AutoroleCodes.ROLE_NOT_FOUND;

        const authorRoles = await (await this.rest.getUserAsMember(userId, guildId)).roles.map(role => role);
        const valAutoRoleModuleRoles = Object.values(guildInfo.valAutoRoleModule).filter(role => typeof role === 'string');
        
        const matchingRole = authorRoles.find(role => valAutoRoleModuleRoles.includes(role));

        if (matchingRole === roleId) {
            return AutoroleCodes.SAME_ROLE;
        }

        try {
            if (matchingRole) await this.rest.removeRole(userId, roleId, guildId);
            await this.rest.addRole(userId, roleId, guildId);
        } catch (err) {
            return AutoroleCodes.ROLE_NOT_FOUND;
        }

        return AutoroleCodes.ROLE_UPDATED;
    }
}

enum AutoroleCodes {
    SAME_ROLE = "SAME_ROLE",
    ROLE_NOT_FOUND = "ROLE_NOT_FOUND",
    ROLE_UPDATED = "ROLE_UPDATED",
    GUILD_NOT_FOUND = "GUILD_NOT_FOUND",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    USER_NOT_LINKED = "USER_NOT_LINKED",
    USER_NOT_IN_GUILD = "USER_NOT_IN_GUILD"
}