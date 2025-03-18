package net.cakeyfox.foxy.command.vanilla.economy

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.User

class RobExecutor : FoxyCommandExecutor() {
    companion object {
        private const val ROB_CHANCE = 0.5
        private const val ROB_COOLDOWN = 86400000 // 24 horas
    }

    override suspend fun execute(context: FoxyInteractionContext) {
        val userToRob = context.getOption<User>("user")!!
        val commandAuthorData = context.getAuthorData()

        if (context.user.id == userToRob.id) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["rob.cantRobYourself"])
            }
            return
        }

        val lastRob = commandAuthorData.lastRob ?: 0
        val timeLeft = lastRob + ROB_COOLDOWN - System.currentTimeMillis()

        if (timeLeft > 0) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale[
                        "rob.cooldown",
                        context.utils.convertLongToDiscordTimestamp((System.currentTimeMillis() + timeLeft) / 1000)
                    ]
                )


            }
            return
        }

        val userToRobData = context.db.utils.user.getFoxyProfile(userToRob.id)

        if (userToRobData.userCakes.balance < 100) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["rob.userNotEnoughCakes", userToRob.asMention])
            }
            return
        }

        context.db.utils.user.updateUser(
            context.user.id,
            mapOf("lastRob" to System.currentTimeMillis())
        )

        if (Math.random() < ROB_CHANCE) {
            val amount = (userToRobData.userCakes.balance * 0.1).toLong()
            context.db.utils.user.removeCakesFromAUser(userToRob.id, amount)
            context.db.utils.user.addCakesToAUser(context.user.id, amount)

            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyYay,
                    context.locale[
                        "rob.success",
                        context.utils.formatLongNumber(amount, "pt", "BR"),
                        userToRob.asMention
                    ]
                )
            }
        } else {
            if (commandAuthorData.userCakes.balance > 1000) {
                context.db.utils.user.removeCakesFromAUser(context.user.id, 1000)
                context.reply {
                    content = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale["rob.youFailedAndLostCakes", "1.000"]
                    )
                }
            } else {
                context.reply {
                    content = pretty(
                        FoxyEmotes.FoxyBan,
                        context.locale[
                            "rob.youFailedAndGotArrested",
                            userToRob.asMention
                        ]
                    )
                }
            }
        }
    }
}