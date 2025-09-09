package net.cakeyfox.foxy.interactions.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.entities.User

class PayExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val userToPay = context.getOption("user", 0, User::class.java)
        val amount = context.getOption("amount", 1, Long::class.java)

        if (amount?.takeIf { it > 0 } == null) {
            return context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["pay.invalidAmount"])
            }
        }

        if (userToPay == null) {
            return context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["pay.cantFindThisUser"])
            }
        }

        val formattedAmount = context.utils.formatUserBalance(amount, context.locale)
        val userBalance = context.getAuthorData().userCakes.balance.toLong() - amount
        val formattedBalance = context.utils.formatUserBalance(userBalance, context.locale)

        if (userToPay.id == context.user.id) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["pay.cantPayYourself"]
                )
            }

            return
        }

        if (!isAbleToPay(context, amount)) return

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyYay,
                context.locale["pay.confirm", formattedAmount, userToPay.asMention]
            )

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.SUCCESS,
                    FoxyEmotes.FoxyDaily,
                    context.locale["pay.confirmButton"]
                ) {

                    context.database.user.removeCakesFromUser(context.user.id, amount)
                    context.database.user.addCakesToUser(userToPay.id, amount)

                    it.edit {
                        content = pretty(
                            FoxyEmotes.FoxyYay,
                            context.locale[
                                "pay.success",
                                formattedAmount,
                                userToPay.asMention,
                                formattedBalance
                            ]
                        )

                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                context.user,
                                ButtonStyle.SECONDARY,
                                FoxyEmotes.FoxyDaily,
                                context.locale["pay.confirmedButton"]
                            ) { }.asDisabled()
                        )
                    }
                }
            )
        }
    }

    private suspend fun isAbleToPay(context: CommandContext, amount: Long): Boolean {
        if (amount <= 0) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["pay.invalidAmount"]
                )
            }

            return false
        }

        if (context.getAuthorData().userCakes.balance < amount) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["pay.notEnoughBalance"]
                )
            }

            return false
        }

        return true
    }
}