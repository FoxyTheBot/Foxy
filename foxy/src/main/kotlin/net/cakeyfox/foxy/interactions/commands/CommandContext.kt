package net.cakeyfox.foxy.interactions.commands

import dev.minn.jda.ktx.messages.InlineMessage
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.database.core.DatabaseClient
import net.cakeyfox.foxy.database.data.user.FoxyUser
import net.cakeyfox.foxy.utils.FoxyUtils
import net.cakeyfox.common.FoxyLocale
import net.dv8tion.jda.api.JDA
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.Member
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.entities.channel.Channel
import net.dv8tion.jda.api.entities.channel.middleman.GuildMessageChannel
import net.dv8tion.jda.api.events.GenericEvent
import net.dv8tion.jda.api.interactions.InteractionHook
import net.dv8tion.jda.api.interactions.modals.Modal
import net.dv8tion.jda.api.interactions.modals.ModalMapping

interface CommandContext {
    val userId: String
    val guildId: String?
    val locale: FoxyLocale
    val jda: JDA
    val database: DatabaseClient
    val utils: FoxyUtils
    val user: User
    val channel: Channel?
    val guild: Guild?
    val member: Member?
    val foxy: FoxyInstance
    val event: GenericEvent

    suspend fun reply(ephemeral: Boolean = false, block: InlineMessage<*>.() -> Unit)
    suspend fun getAuthorData(): FoxyUser
    suspend fun getGuildData(): net.cakeyfox.foxy.database.data.guild.Guild?
    suspend fun defer(ephemeral: Boolean = false): InteractionHook?
    suspend fun deferEdit(): InteractionHook?
    suspend fun edit(block: InlineMessage<*>.() -> Unit): Unit?
    suspend fun sendModal(modal: Modal): Void?
    fun getValue(name: String): ModalMapping?
    fun <T> getOption(name: String, argNumber: Int = 0, type: Class<T>, isFullString: Boolean = false): T?
}