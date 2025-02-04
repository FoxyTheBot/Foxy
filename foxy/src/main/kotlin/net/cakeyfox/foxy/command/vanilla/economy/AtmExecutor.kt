package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.User

class AtmExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user") ?: context.event.user
        val userBalance = context.foxy.mongoClient.utils.user.getDiscordUser(user.id).userCakes.balance
        val formattedBalance = context.utils.formatNumber(userBalance, "pt", "BR")
        val type = context.getOption<String>("type") ?: "normal"

        when (type) {
            "normal" -> {
                context.reply {
                    content = pretty(
                        FoxyEmotes.FoxyDaily,
                        context.locale["cakes.atm.balance", user.asMention, formattedBalance]
                    )
                }
            }

            "full" -> {
                val lorittaBalance = context.foxy.utils.loritta.getLorittaProfile(user.idLong).sonhos
                val formattedLorittaBalance = context.utils.formatLongNumber(lorittaBalance, "pt", "BR")
                context.reply {
                    embed {
                        title = context.locale["cakes.atm.balanceTitle", user.name]
                        thumbnail = user.effectiveAvatarUrl
                        color = Colors.FOXY_DEFAULT

                        field {
                            name = context.locale["cakes.atm.foxyBalance"]
                            value = "$formattedBalance Cakes"
                        }

                        field {
                            name = context.locale["cakes.atm.lorittaBalance"]
                            value = "$formattedLorittaBalance Sonhos"
                        }
                    }
                }
            }
        }
    }
}