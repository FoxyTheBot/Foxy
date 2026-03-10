package net.cakeyfox.foxy.modules

import dev.minn.jda.ktx.coroutines.await
import kotlinx.coroutines.delay
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.PlaceholderUtils.getAllPlaceholders
import net.cakeyfox.foxy.utils.discord.DiscordMessageUtils
import net.cakeyfox.foxy.utils.discord.DiscordMessageUtils.getMessageFromJson
import net.cakeyfox.serializable.data.website.DiscordServer
import net.dv8tion.jda.api.events.message.GenericMessageEvent
import net.dv8tion.jda.api.events.message.MessageReceivedEvent
import net.dv8tion.jda.api.events.message.MessageUpdateEvent

class InviteBlockerModule(
    val foxy: FoxyInstance
) {

    companion object {
        val DISCORD_INVITE = Regex(
            """(?:https?://)?(?:www\.)?(discord(?:\.com|app\.com)/invite/\S+|discord\.gg(?:/invite/\S+)?)""",
            RegexOption.IGNORE_CASE
        )

        val DISBOARD_LINK = Regex(
            """(?:https?://)?(?:www\.)?disboard\.org/\S+""",
            RegexOption.IGNORE_CASE
        )
    }

    suspend fun handleMessage(event: GenericMessageEvent) {
        val settings = foxy.database.guild.getGuild(event.guild.id).inviteBlockerSettings
            ?: return

        if (!settings.isEnabled) return

        val message = when (event) {
            is MessageReceivedEvent -> event.message
            is MessageUpdateEvent -> event.message
            else -> return
        }

        val member = message.member ?: return
        val rawContent = message.contentRaw
        val discordServer = DiscordServer(
            id = event.guild.id,
            name = event.guild.name,
            icon = null,
            banner = event.guild.bannerUrl,
            owner = false,
            permissions = 0L,
            iconUrl = event.guild.iconUrl
        )

        if (isMemberAuthorized(member.roles.map { it.id }, settings.rolesThatCanSendInvites)) return
        if (settings.channelsThatCanSendInvites?.contains(message.channel.id) == true) return
        if (!containsBlockedInvite(rawContent)) return

        val placeholders = getAllPlaceholders(discordServer, message.author)
        val rawMessage = settings.message?.takeIf { it.isNotEmpty() }
            ?: foxy.locale["youCantSendInviteHere"]
        val (content, embeds) = getMessageFromJson(rawMessage, placeholders)

        message.delete().await()
        val botReply = message.channel.sendMessage(content).setEmbeds(embeds).await()
        delay(5_000)
        botReply.delete().await()
    }

    private fun isMemberAuthorized(
        memberRoles: List<String>,
        authorizedRoles: List<String>?
    ): Boolean {
        return memberRoles.any { it in (authorizedRoles ?: emptyList()) }
    }

    private fun containsBlockedInvite(content: String): Boolean {
        return DISCORD_INVITE.containsMatchIn(content) ||
                DISBOARD_LINK.containsMatchIn(content)
    }
}