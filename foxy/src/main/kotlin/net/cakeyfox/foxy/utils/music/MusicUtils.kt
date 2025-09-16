package net.cakeyfox.foxy.utils.music

import dev.arbjerg.lavalink.client.LavalinkClient
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.dv8tion.jda.api.entities.channel.Channel

fun getOrCreateMusicManager(
    guildId: Long,
    lavalink: LavalinkClient,
    context: CommandContext,
    channel: Channel
): GuildMusicManager {
    var manager = context.foxy.musicManagers[guildId]

    if (manager == null) {
        manager = GuildMusicManager(guildId, lavalink)
        context.foxy.musicManagers[guildId] = manager
    }

    return manager
}

fun processQuery(searchQuery: String): String {
    val soundCloudRegex = Regex("""https?://(www\.)?soundcloud\.com/.+""", RegexOption.IGNORE_CASE)
    val authorizedFilesExtensions = listOf("mp3", "wav", "flac", "ogg", "m4a", "mp4", "webm")
    val authorizedDiscordCdnFileRegex = Regex(
        """https?://(www\.)?cdn\.discordapp\.com/.+\.(${authorizedFilesExtensions.joinToString("|")})(\?.*)?$""",
        RegexOption.IGNORE_CASE
    )

    return when {
        soundCloudRegex.matches(searchQuery) -> searchQuery
        authorizedDiscordCdnFileRegex.matches(searchQuery) -> searchQuery
        searchQuery.startsWith("scsearch:", ignoreCase = true) -> searchQuery
        searchQuery.startsWith("ytsearch:", ignoreCase = true) -> "scsearch:${searchQuery.removePrefix("ytsearch:")}"
        else -> "scsearch:$searchQuery"
    }
}
