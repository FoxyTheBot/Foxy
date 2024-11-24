export interface FoxyGuild {
    _id: string,
    GuildJoinLeaveModule: WelcomerModule,
    AutoRoleModule: AutoRoleModule,
    premiumKeys: FoxyKey[],
    guildSettings: GuildSettings,
    dashboardLogs: DashboardLog[],

    save: () => Promise<void>,
    isNew?: boolean | false,
}

export interface WelcomerModule {
    isEnabled: boolean,
    joinMessage: string,
    alertWhenUserLeaves: boolean,
    leaveMessage: string,
    joinChannel: string,
    leaveChannel: string,
}

export interface AutoRoleModule {
    isEnabled: boolean,
    roles: string[],
}

export interface GuildSettings {
    prefix: string,
    disabledCommands: string[],
    blockedChannels: string[],
    sendMessageIfChannelIsBlocked: boolean,
    deleteMessageIfCommandIsExecuted: boolean,
    usersWhoCanAccessDashboard: string[],
}

export interface DashboardLog {
    _id: string,
    user: string,
    action: string,
    date: Date,
}