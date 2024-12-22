package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.serializable.database.data.FoxyUser
import net.dv8tion.jda.api.entities.User

class CoinflipBetExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user")!!
        val amount = context.getOption<Int>("amount")!!
        val side = context.getOption<String>("side")!!
        val userToBet = context.db.utils.user.getDiscordUser(user.id)

        checkBalance(context, userToBet, amount)

        context.reply {
            content = context.prettyResponse {
                emoteId = FoxyEmotes.FOXY_DAILY
                content = context.locale[
                    "coinflipBetExecutor.propose",
                    user.asMention,
                    amount.toString(),
                    "coinflipBetExecutor.${side.lowercase()}"
                ]
            }

            actionRow(
                // TODO: Create a button for the user to accept or reject the bet
            )
        }
    }

    private fun flipCoin(): Boolean {
        return (0..1).random() == 1
    }

    private suspend fun checkBalance(context: FoxyInteractionContext, user: FoxyUser, amount: Int) {
        if (amount < 1) {
            context.reply {
                content = context.prettyResponse {
                    content = context.locale["coinflipBetExecutor.amountTooLow"]
                }
            }
            return
        }

        if (amount > user.userCakes.balance) {
            context.reply {
                content = context.prettyResponse {
                    content = context.locale["coinflipBetExecutor.userHasNotEnoughBalance"]
                }
            }
            return
        }

        if (amount > context.authorData.userCakes.balance) {
            context.reply {
                content = context.prettyResponse {
                    content = context.locale["coinflipBetExecutor.youHaveNotEnoughBalance"]
                }
            }
            return
        }

        if (user._id == context.authorData._id) {
            context.reply {
                content = context.prettyResponse {
                    content = context.locale["coinflipBetExecutor.cannotBetAgainstYourself"]
                }
            }
            return
        }
    }
}