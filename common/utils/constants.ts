export const constants = {
    VALORANT_AUTOROLE_UPDATE(guildId: string, userId): string {
        return `/guilds/${guildId}/user/${userId}`;
    }
}