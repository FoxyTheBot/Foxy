import { Member } from "discordeno/transformers";
import { FoxyClient } from "../../structures/types/foxy";
import ChatInputInteractionContext from "../../command/structures/ChatInputInteractionContext";

export default class ValAutoRoleModule {
    public bot: FoxyClient;
    public context: ChatInputInteractionContext
    constructor(bot, context) {
        this.bot = bot;
        this.context = context;
    }

    async updateRole(member: Member) {
        if (!member) return;
        const guildId = member.guildId;
        const guildInfo = await this.bot.database.getGuild(guildId);
        const userInfo = await this.bot.database.getUser(member.id);
        if (!userInfo.riotAccount.isLinked) return;
        const valUserInfo = await this.bot.foxyRest.getMMR(userInfo.riotAccount.puuid);

        const authorRoles = member.roles.map(role => role ? role.toString() : null);
        const valAutoRoleModuleRoles = Object.values(guildInfo.valAutoRoleModule);

        const cleanedAuthorRoles = authorRoles.filter(role => role !== null).map(role => role.toLowerCase().trim());
        const cleanedValAutoRoleModuleRoles = valAutoRoleModuleRoles.filter(role => role !== null && typeof role !== 'boolean').map(role => role);

        const matchingRole = cleanedAuthorRoles.find(role => {
            return cleanedValAutoRoleModuleRoles.includes(role);
        });

        const tier = valUserInfo.data.current_data.currenttierpatched || "unrated";
        const patchedTier: string = tier.match(/[a-zA-Z]+/)[0].toLowerCase();
        const role = guildInfo.valAutoRoleModule[patchedTier + "Role"];

        if (!role) return;
        if (matchingRole === role) {
            return this.context.sendReply({
                embeds: [{
                    title: this.context.makeReply(this.bot.emotes.VALORANT_LOGO, this.bot.locale('commands:valorant.update-role.embed.title')),
                    description:this.bot.locale('commands:valorant.update-role.embed.sameRole')
                }],
                flags: 64,
            })
        }
        if (!matchingRole) {
            setTimeout(() => {
                this.bot.helpers.addRole(guildId, member.id, role);
                return this.context.sendReply({
                    embeds: [{
                        title: this.context.makeReply(this.bot.emotes.VALORANT_LOGO, this.bot.locale('commands:valorant.update-role.embed.title')),
                        description: this.bot.locale('commands:valorant.update-role.embed.yourRolesHasBeenUpdated')
                    }],
                    flags: 64
                })
            }, 2000);
        }

        if (matchingRole) {
            setTimeout(() => {
                this.bot.helpers.removeRole(guildId, member.id, matchingRole);
                setTimeout(() => {
                    this.bot.helpers.addRole(guildId, member.id, role);
                    return this.context.sendReply({
                        embeds: [{
                            title: this.context.makeReply(this.bot.emotes.VALORANT_LOGO, this.bot.locale('commands:valorant.update-role.embed.title')),
                            description: this.bot.locale('commands:valorant.update-role.embed.yourRolesHasBeenUpdated')
                        }],
                        flags: 64
                    })
                }, 2000);
            }, 2000);
        }
        return true;
    }
}