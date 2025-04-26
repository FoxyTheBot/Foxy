package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.components.button.ButtonStyle

class PayExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val userToPay = context.getOption<User>("user")!!
        val amount = context.getOption<Long>("amount")!!
        val formattedAmount = context.utils.formatUserBalance(amount, context.locale)
        val userBalance = context.getAuthorData().userCakes.balance.toLong() - amount
        val formattedBalance = context.utils.formatUserBalance(userBalance, context.locale)

        isAbleToPay(context, userToPay, amount)

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

    private suspend fun isAbleToPay(context: FoxyInteractionContext, userToPay: User, amount: Long) {
        if (amount <= 0) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["pay.invalidAmount"]
                )
            }

            return
        }

        if (context.getAuthorData().userCakes.balance < amount) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["pay.notEnoughCakes"]
                )
            }

            return
        }

        if (userToPay.id == context.user.id) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["pay.cantPayYourself"]
                )
            }

            return
        }
    }
}