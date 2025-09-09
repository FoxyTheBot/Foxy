package net.cakeyfox.foxy.interactions.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.entities.User

class CoinflipBetExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val user = context.getOption("user", 0, User::class.java)
        val amount = context.getOption("amount", 1, Long::class.java)
        val side = context.getOption("side", 2, String::class.java)

        if (user == null || amount == null || side == null) return
        val formattedAmount = context.utils.formatUserBalance(amount, context.locale)
        val userToBet = context.database.user.getFoxyProfile(user.id)

        if (amount < 1) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["coinflipbet.amountTooLow"]
                )
            }
            return
        }

        if (amount > userToBet.userCakes.balance) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["coinflipbet.userHasNotEnoughBalance"]
                )
            }
            return
        }

        if (amount > context.getAuthorData().userCakes.balance) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["coinflipbet.youHaveNotEnoughBalance"]
                )
            }
            return
        }

        if (user.id == context.user.id) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["coinflipbet.cannotBetAgainstYourself"]
                )
            }
            return
        }

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyDaily,
                context.locale[
                    "coinflipbet.proposal",
                    user.asMention,
                    context.user.asMention,
                    formattedAmount,
                    context.locale["coinflipbet.$side"]
                ]
            )

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    user,
                    ButtonStyle.SUCCESS,
                    FoxyEmotes.FoxyDaily,
                    context.locale["coinflipbet.acceptButton"]
                ) {
                    val result = flipCoin()

                    if (side == result) {
                        context.database.user.updateUser(
                            context.user.id,
                            mapOf(
                                "userCakes.balance" to context.getAuthorData().userCakes.balance + amount
                            )
                        )

                        context.database.user.updateUser(
                            user.id,
                            mapOf(
                                "userCakes.balance" to userToBet.userCakes.balance - amount
                            )
                        )

                        editAndDisableButtons(
                            it,
                            FoxyEmotes.FoxyDaily,
                            context.locale[
                                "coinflipbet.betResult",
                                context.locale["coinflipbet.$result"],
                                context.user.asMention, // User who won
                                formattedAmount,
                                user.asMention // User who lost
                            ],
                            true
                        )

                    } else {
                        context.database.user.updateUser(
                            context.user.id,
                            mapOf(
                                "userCakes.balance" to context.getAuthorData().userCakes.balance - amount
                            )
                        )

                        context.database.user.updateUser(
                            user.id,
                            mapOf(
                                "userCakes.balance" to userToBet.userCakes.balance + amount
                            )
                        )

                        editAndDisableButtons(
                            it,
                            FoxyEmotes.FoxyDaily,
                            context.locale[
                                "coinflipbet.betResult",
                                context.locale["coinflipbet.$result"],
                                user.asMention, // User who won
                                formattedAmount,
                                context.user.asMention // User who lost
                            ],
                            true
                        )
                    }
                },

                context.foxy.interactionManager.createButtonForUser(
                    user,
                    ButtonStyle.DANGER,
                    FoxyEmotes.FoxyCry,
                    context.locale["coinflipbet.declineButton"]
                ) {
                    editAndDisableButtons(
                        it,
                        FoxyEmotes.FoxyCry,
                        context.locale["coinflipbet.declined"]
                    )
                }
            )
        }
    }

    private fun flipCoin(): String {
        return if (Math.random() < 0.5) "heads" else "tails"
    }

    private suspend fun editAndDisableButtons(
        context: CommandContext,
        emoji: String,
        message: String,
        isFollowUp: Boolean = false
    ) {
        if (!isFollowUp) {
            context.edit {
                content = pretty(
                    emoji,
                    message
                )

                actionRow(
                    context.foxy.interactionManager.createButtonForUser(
                        context.user,
                        ButtonStyle.SUCCESS,
                        FoxyEmotes.FoxyDaily,
                        context.locale["coinflipbet.acceptButton"]
                    ) { }.asDisabled(),

                    context.foxy.interactionManager.createButtonForUser(
                        context.user,
                        ButtonStyle.DANGER,
                        FoxyEmotes.FoxyCry,
                        context.locale["coinflipbet.declineButton"]
                    ) { }.asDisabled()
                )
            }
        } else {
            context.edit {
                actionRow(
                    context.foxy.interactionManager.createButtonForUser(
                        context.user,
                        ButtonStyle.SUCCESS,
                        FoxyEmotes.FoxyDaily,
                        context.locale["coinflipbet.acceptButton"]
                    ) { }.asDisabled(),

                    context.foxy.interactionManager.createButtonForUser(
                        context.user,
                        ButtonStyle.DANGER,
                        FoxyEmotes.FoxyCry,
                        context.locale["coinflipbet.declineButton"]
                    ) { }.asDisabled()
                )
            }

            // Let's send a follow-up message with the result

            context.reply {
                content = pretty(
                    emoji,
                    message
                )
            }
        }
    }
}