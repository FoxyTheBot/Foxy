package net.cakeyfox.common

enum class LogType(val value: String) {
    UNKNOWN_UPDATE("0"),
    UPDATE_GENERAL_SETTINGS("1"),
    UPDATE_WELCOMER_SETTINGS("2"),
    UPDATE_AUTO_ROLE_SETTINGS("3"),
    UPDATE_INVITE_BLOCKER_SETTINGS("4"),
    UPDATE_SERVER_LOGS_SETTINGS("5"),
    UPDATE_YOUTUBE_SETTINGS("6"),
    UPDATE_TWITCH_SETTINGS("7"),
    UPDATE_PREMIUM_SETTINGS("8"),
    UPDATE_PARTNERSHIP_SETTINGS("9");

    companion object {
        private val valueMap = entries.associateBy(LogType::value)
        private val rawMap = entries.associateBy { it.name }

        fun fromDb(value: String): LogType {
            return valueMap[value] ?: rawMap[value] ?: UNKNOWN_UPDATE
        }
    }
}