package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class PayExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val userToPay = context.getOption<User>("user")!!
        val amount = context.getOption<Long>("amount")!!

        isAbleToPay(context, userToPay, amount)

        val userToPayData = context.db.utils.user.getDiscordUser(userToPay.id)

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyYay,
                context.locale["pay.confirm", amount.toString(), userToPay.asMention]
            )

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.SUCCESS,
                    FoxyEmotes.FoxyDaily,
                    context.locale["pay.confirmButton"]
                ) {

                    context.db.utils.user.updateUser(
                        context.user.id,
                        mapOf(
                            "userCakes.balance" to context.authorData.userCakes.balance - amount
                        )
                    )

                    context.db.utils.user.updateUser(
                        userToPay.id,
                        mapOf(
                            "userCakes.balance" to userToPayData.userCakes.balance + amount
                        )
                    )

                    it.edit {
                        content = pretty(
                            FoxyEmotes.FoxyCry,
                            context.locale["pay.success", amount.toString(), userToPay.asMention]
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
                    context.locale["error.invalidAmount"]
                )
            }

            return
        }

        if (context.authorData.userCakes.balance < amount) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["error.notEnoughCakes"]
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