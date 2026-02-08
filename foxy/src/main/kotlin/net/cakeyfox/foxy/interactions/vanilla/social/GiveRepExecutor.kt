package net.cakeyfox.foxy.interactions.vanilla.social

import kotlinx.datetime.Clock
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.events.interaction.command.UserContextInteractionEvent
import kotlin.time.Duration.Companion.days
import kotlin.time.Duration.Companion.hours

class GiveRepExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val user = when (context.event) {
            is UserContextInteractionEvent -> (context.event as UserContextInteractionEvent).target
            else -> context.getOption("user", 0, User::class.java)
        }

        val reason = if (context.event is SlashCommandInteractionEvent) {
            context.getOption(
                "reason",
                1,
                String::class.java,
                true
            )
        } else context.locale["rep.give.defaultReason"]

        if (reason.isNullOrEmpty()) {
            return context.reply {
                content = pretty(
                    FoxyEmotes.FoxyRage,
                    context.locale["rep.give.youMustProvideAReason"]
                )
            }
        }

        val lastRep = context.getAuthorData().userProfile.lastRep

        if (user == null) return

        if (lastRep != null) {
            val now = Clock.System.now()
            val nextAvailableRep = lastRep.plus(1.hours)

            if (now < nextAvailableRep) {
                return context.reply(true) {
                    content = pretty(
                        FoxyEmotes.FoxyRage, context.locale[
                            "rep.give.youCantGiveRepUntil",
                            context.utils.convertISOToSimpleDiscordTimestamp(nextAvailableRep)
                        ]
                    )
                }
            }
        }

        context.database.user.addReputation(user.id, reason)
        context.database.user.updateUser(context.user.id) {
            userProfile.lastRep = Clock.System.now()
        }

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyYay,
                context.locale["rep.give.youGaveRepToUser", user.asMention]
            )
        }
    }
}