package net.cakeyfox.foxy.interactions.vanilla.entertainment

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.interaction.command.UserContextInteractionEvent
import kotlin.math.roundToInt
import kotlin.random.Random

class GayCommandExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val gayMeter = Random.nextInt(0, 101)
        val totalBars = 10
        val filledBars = (gayMeter / 10.0).roundToInt()
        val bar = "█".repeat(filledBars) + "░".repeat(totalBars - filledBars)
        val user = when (context.event) {
            is UserContextInteractionEvent -> (context.event as UserContextInteractionEvent).target
            else -> context.getOption("user", 0, User::class.java) ?: context.user
        }

        context.reply {
            embed {
                color = Colors.FOXY_DEFAULT
                title = pretty(
                    FoxyEmotes.FoxyWow,
                    context.locale["gayMeter.embed.title"]
                )
                description = context.locale["gayMeter.embed.description", user.asMention]

                field {
                    name = context.locale["gayMeter.embed.field"]
                    value = "$bar $gayMeter%"
                }

                footer(context.locale["gayMeter.embed.footer"])
            }
        }
    }
}