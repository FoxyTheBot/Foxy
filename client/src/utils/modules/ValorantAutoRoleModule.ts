import { Member } from "discordeno/transformers";
import { FoxyClient } from "../../structures/types/FoxyClient";
import UnleashedCommandExecutor from "../../command/structures/UnleashedCommandExecutor";

export default class ValAutoRoleModule {
    public bot: FoxyClient;
    public context: UnleashedCommandExecutor;
    
    constructor(bot: FoxyClient, context: UnleashedCommandExecutor) {
        this.bot = bot;
        this.context = context;
    }

    async updateRole(member: Member) {
        if (!member) return;

        const guildId = member.guildId;
        const guildInfo = await this.bot.database.getGuild(guildId);
        const userInfo = await this.bot.database.getUser(member.id);

        if (!userInfo?.riotAccount?.isLinked) return;

        const valUserInfo = await this.bot.rest.foxy.getMMR(userInfo.riotAccount.puuid);
        const currentTier = valUserInfo.data.current_data.currenttierpatched?.toLowerCase() || "unrated";
        const patchedTier = currentTier.match(/[a-zA-Z]+/)?.[0] ?? "unrated";
        const role = guildInfo.valAutoRoleModule[patchedTier + "Role"];

        if (!role) return;

        const authorRoles = member.roles.map(role => role.toString()?.toLowerCase()?.trim()).filter(Boolean);
        const valAutoRoleModuleRoles = Object.values(guildInfo.valAutoRoleModule).filter(role => typeof role === 'string');
        
        const matchingRole = authorRoles.find(role => valAutoRoleModuleRoles.includes(role));

        const roleChangeMessage = {
            title: this.context.makeReply(this.bot.emotes.VALORANT_LOGO, this.bot.locale('commands:valorant.update-role.embed.title')),
            description: ''
        };

        if (matchingRole === role) {
            roleChangeMessage.description = this.bot.locale('commands:valorant.update-role.embed.sameRole');
            return this.context.sendReply({ embeds: [roleChangeMessage], flags: 64 });
        }

        try {
            if (matchingRole) await this.bot.helpers.removeRole(guildId, member.id, matchingRole);
            await this.bot.helpers.addRole(guildId, member.id, role);
            roleChangeMessage.description = this.context.getEmojiById(this.bot.emotes.FOXY_YAY) + " " + this.bot.locale('commands:valorant.update-role.embed.yourRolesHasBeenUpdated');
        } catch (err) {
            roleChangeMessage.description = this.context.getEmojiById(this.bot.emotes.FOXY_CRY) + " " + this.bot.locale('commands:valorant.update-role.embed.roleNotFound');
        }

        return this.context.sendReply({ embeds: [roleChangeMessage], flags: 64 });
    }
}
