package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.entities.User

class RobExecutor : FoxyCommandExecutor() {
    companion object {
        private const val ROB_CHANCE = 0.5
    }

    override suspend fun execute(context: FoxyInteractionContext) {
        val userToRob = context.getOption<User>("user")!!

        if (context.user.id == userToRob.id) {
            context.reply(true) {
                content = context.locale["rob.cantRobYourself"]
            }
            return
        }

        // TODO: Add cooldown field to database

        val userToRobData = context.db.utils.user.getFoxyProfile(userToRob.id)

        if (userToRobData.userCakes.balance < 100) {
            context.reply(true) {
                content = context.locale["rob.userNotEnoughCakes", userToRob.asMention]
            }
            return
        }

        if (Math.random() < ROB_CHANCE) {
            val amount = (userToRobData.userCakes.balance * 0.1).toLong()
            context.db.utils.user.removeCakesFromAUser(userToRob.id, amount)
            context.db.utils.user.addCakesToAUser(context.user.id, amount)

            context.reply {
                content = context.locale[
                    "rob.success",
                    context.utils.formatLongNumber(amount, "pt", "BR"),
                    userToRob.asMention
                ]
            }
        } else {
            if (context.getAuthorData().userCakes.balance > 1000) {
                context.db.utils.user.removeCakesFromAUser(context.user.id, 1000)
                context.reply {
                    content = context.locale["rob.youFailedAndLostCakes", "1000"]
                }
            } else {
                context.reply {
                    content = context.locale[
                        "rob.youFailedAndGotArrested",
                        userToRob.asMention
                    ]
                }
            }
        }
    }
}