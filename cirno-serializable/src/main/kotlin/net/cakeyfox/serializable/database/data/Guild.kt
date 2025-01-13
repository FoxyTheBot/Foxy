package net.cakeyfox.serializable.database.data

import kotlinx.serialization.Serializable

@Serializable
data class Guild(
    val _id: String,
    val guildAddedAt: Long,
    val GuildJoinLeaveModule: WelcomerModule,
    val AutoRoleModule: AutoRoleModule,
    val antiRaidModule: AntiRaidModule,
    val premiumKeys: List<Key> = emptyList(),
    val guildSettings: GuildSettings,
    val dashboardLogs: List<DashboardLog> = emptyList(),
)

@Serializable
data class WelcomerModule(
    val isEnabled: Boolean = false,
    val joinMessage: String? = null,
    val alertWhenUserLeaves: Boolean = false,
    val leaveMessage: String? = null,
    val joinChannel: String? = null,
    val leaveChannel: String? = null,
)

@Serializable
data class AntiRaidModule(
    val handleMultipleMessages: Boolean = false,
    val handleMultipleJoins: Boolean = false,
    val handleMultipleChars: Boolean = false,
    val messagesThreshold: Int = 8,
    val newUsersThreshold: Int = 5,
    val repeatedCharsThreshold: Int = 10,
    val warnsThreshold: Int = 3,
    val alertChannel: String? = null,
    val actionForMassJoin: String = "NOTHING",
    val actionForMassMessage: String = "TIMEOUT",
    val actionForMassChars: String = "WARN",
    val timeoutDuration: Long = 10000,
    val whitelistedChannels: List<String> = emptyList(),
    val whitelistedRoles: List<String> = emptyList(),
)

@Serializable
data class AutoRoleModule(
    val isEnabled: Boolean = false,
    val roles: List<String> = emptyList(),
)

@Serializable
data class GuildSettings(
    val prefix: String = "f!",
    val language: String = "pt-BR",
    val disabledCommands: List<String> = emptyList(),
    val blockedChannels: List<String> = emptyList(),
    val sendMessageIfChannelIsBlocked: Boolean = false,
    val deleteMessageIfCommandIsExecuted: Boolean = false,
    val usersWhoCanAccessDashboard: List<String> = emptyList(),
)

@Serializable
data class DashboardLog(
    val authorId: String?,
    val actionType: String?,
    val date: Long
)