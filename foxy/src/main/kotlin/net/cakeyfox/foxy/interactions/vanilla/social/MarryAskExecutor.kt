package net.cakeyfox.foxy.interactions.vanilla.social

import kotlinx.datetime.Instant
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.entities.User
import java.time.ZoneId
import java.time.ZonedDateTime

class MarryAskExecutor : UnleashedCommandExecutor() {
    companion object {
        const val MARRIAGE_TAX = 6000
    }

    override suspend fun execute(context: CommandContext) {
        val user = context.getOption("user", 0, User::class.java)
        if (user == null) return

        if (user.id == context.user.id) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["marry.cantMarryYourself"]
                )
            }
            return
        }

        if (user.isBot) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["marry.cantMarryBot", user.asMention]
                )
            }
            return
        }

        if (user.id == context.jda.selfUser.id) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["marry.cantMarryMe"]
                )
            }
            return
        }

        val userData = context.database.user.getFoxyProfile(user.id)
        val authorData = context.getAuthorData()

        if (userData.marryStatus.marriedWith != null) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["marry.userAlreadyMarried"]
                )
            }
            return
        }

        if (context.getAuthorData().marryStatus.marriedWith != null) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["marry.youAlreadyMarried"]
                )
            }
            return
        }
        val isUserPremium = isPremium(userData.userPremium.premiumDate)
        val isAuthorPremium = isPremium(authorData.userPremium.premiumDate)
        if (isUserPremium || isAuthorPremium) {
            buildMarryMessage(context)
        } else {
            if (context.getAuthorData().userCakes.balance < MARRIAGE_TAX) {
                context.reply(true) {
                    content = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale["marry.authorHasNoCakes"]
                    )
                }

                return

            } else if (userData.userCakes.balance < MARRIAGE_TAX) {
                context.reply {
                    content = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale["marry.userHasNoCakes", user.asMention]
                    )
                }
                return
            } else buildMarryMessage(context)
        }
    }

    private suspend fun buildMarryMessage(context: CommandContext) {
        val user = context.getOption("user", 0, User::class.java)
        if (user == null) return
        val userData = context.database.user.getFoxyProfile(user.id)
        val authorData = context.getAuthorData()
        val isUserPremium = isPremium(userData.userPremium.premiumDate)
        val isAuthorPremium = isPremium(authorData.userPremium.premiumDate)
        val marriedDate = ZonedDateTime.now(ZoneId.systemDefault()).toInstant()

        context.reply {
            content = if (isUserPremium || isAuthorPremium) {
                pretty(
                    FoxyEmotes.Ring,
                    context.locale["marry.premiumProposal", user.asMention, context.user.asMention]
                )
            } else {
                pretty(
                    FoxyEmotes.Ring,
                    context.locale["marry.proposal", user.asMention, context.user.asMention]
                )
            }

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    user,
                    ButtonStyle.SUCCESS,
                    FoxyEmotes.FoxyCake,
                    context.locale["marry.acceptButton"],
                ) {
                    context.database.user.updateUser(
                        context.user.id,
                        if (isAuthorPremium || isUserPremium) {
                            mapOf(
                                "marryStatus.marriedWith" to user.id,
                                "marryStatus.marriedDate" to marriedDate,
                            )
                        } else {
                            mapOf(
                                "marryStatus.marriedWith" to user.id,
                                "marryStatus.marriedDate" to marriedDate,
                                "userCakes.balance" to authorData.userCakes.balance - MARRIAGE_TAX
                            )
                        }
                    )

                    context.database.user.updateUser(
                        user.id,
                        if (isAuthorPremium || isUserPremium) {
                            mapOf(
                                "marryStatus.marriedWith" to context.user.id,
                                "marryStatus.marriedDate" to marriedDate
                            )
                        } else {
                            mapOf(
                                "marryStatus.marriedWith" to context.user.id,
                                "marryStatus.marriedDate" to marriedDate,
                                "userCakes.balance" to userData.userCakes.balance - MARRIAGE_TAX
                            )
                        }
                    )

                    it.edit {
                        content = pretty(
                            FoxyEmotes.Ring,
                            context.locale["marry.accepted", user.asMention]
                        )

                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                user,
                                ButtonStyle.SUCCESS,
                                FoxyEmotes.FoxyCake,
                                context.locale["marry.acceptedButton"]
                            ) { }.asDisabled()
                        )
                    }
                }
            )
        }
    }

    private fun isPremium(premiumDate: Instant?): Boolean {
        val currentEpoch = System.currentTimeMillis() / 1000
        return premiumDate?.epochSeconds?.let { it > currentEpoch } ?: false
    }
}