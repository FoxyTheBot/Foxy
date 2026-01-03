package net.cakeyfox.foxy.interactions.vanilla.social

import kotlinx.datetime.Clock
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User
import kotlin.time.Duration.Companion.days

class GiveRepExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val user = context.getOption("user", 0, User::class.java)
        val reason = context.getOption("reason", 1, String::class.java, true)
        val lastRep = context.getAuthorData().userProfile.lastRep

        if (user == null || reason == null) return

        if (lastRep != null) {
            if (lastRep >= Clock.System.now()) {
                return context.reply(true) {
                    content = pretty(FoxyEmotes.FoxyRage, context.locale[
                        "rep.give.youCantGiveRepUntil",
                        context.utils.convertISOToSimpleDiscordTimestamp(lastRep.plus(1.days))
                    ])
                }
            }
        }

        context.database.user.addReputation(user.id, reason)
        context.database.user.updateUser(context.user.id) {
            userProfile.lastRep = Clock.System.now()
        }

        context.reply {
            content = pretty(FoxyEmotes.FoxyYay, context.locale["rep.give.youGaveRepToUser", user.asMention])
        }
    }
}