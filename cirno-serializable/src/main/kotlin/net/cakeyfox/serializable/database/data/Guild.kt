package net.cakeyfox.serializable.database.data

import kotlinx.datetime.Instant
import kotlinx.serialization.Serializable
import net.cakeyfox.serializable.database.utils.MongoDateSerializer

@Serializable
data class Guild(
    val _id: String,
    val GuildJoinLeaveModule: WelcomerModule,
    val AutoRoleModule: AutoRoleModule,
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
data class AutoRoleModule(
    val isEnabled: Boolean = false,
    val roles: List<String> = emptyList(),
)

@Serializable
data class GuildSettings(
    val prefix: String = "f!",
    val disabledCommands: List<String> = emptyList(),
    val blockedChannels: List<String> = emptyList(),
    val sendMessageIfChannelIsBlocked: Boolean = false,
    val deleteMessageIfCommandIsExecuted: Boolean = false,
    val usersWhoCanAccessDashboard: List<String> = emptyList(),
)

@Serializable
data class DashboardLog(
    val _id: String,
    val user: String,
    val action: String,
    @Serializable(with = MongoDateSerializer::class)
    val date: Instant
)