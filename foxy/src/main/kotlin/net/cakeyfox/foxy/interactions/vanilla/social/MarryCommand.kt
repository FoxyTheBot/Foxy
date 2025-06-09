package net.cakeyfox.foxy.interactions.vanilla.social

import kotlinx.datetime.Instant
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle
import java.time.ZoneId
import java.time.ZonedDateTime

class MarryCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("marry", CommandCategory.SOCIAL) {
        interactionContexts = listOf(InteractionContextType.GUILD, InteractionContextType.PRIVATE_CHANNEL)
        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)

        subCommand("ask") {
            addOption(opt(OptionType.USER, "user", true))
            executor = MarryAskExecutor()
        }

//        subCommand("leaderboard") { executor = MarryLeaderboard() }
    }

    inner class MarryLeaderboard : FoxySlashCommandExecutor() {
        override suspend fun execute(context: FoxyInteractionContext) {
            context.defer()

            val topUsers = context.foxy.leaderboardManager.getMarriageLeaderboard()

            context.reply {
                embed {
                    title = pretty(FoxyEmotes.FoxyYay, context.locale["top.marriage.embed.title"])
                    color = Colors.FOXY_DEFAULT
                    topUsers.forEach { user ->
                        val formattedDate = context.utils.convertISOToSimpleDiscordTimestamp(user.marriedDate)

                        field {
                            name = "#${user.rank}. ${user.username}"
                            value = "**Casado(a) com:** ${user.marriedWith}\nDesde: $formattedDate"
                            inline = true
                        }
                    }
                }
            }
        }
    }

    inner class MarryAskExecutor : FoxySlashCommandExecutor() {
        override suspend fun execute(context: FoxyInteractionContext) {
            val user = context.getOption<User>("user")!!

            if (user.id == context.event.user.id) {
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
                if (context.getAuthorData().userCakes.balance < 6000) {
                    context.reply(true) {
                        content = pretty(
                            FoxyEmotes.FoxyCry,
                            context.locale["marry.authorHasNoCakes"]
                        )
                    }

                    return

                } else if (userData.userCakes.balance < 6000) {
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

        private suspend fun buildMarryMessage(context: FoxyInteractionContext) {
            val user = context.getOption<User>("user")!!
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
                            context.event.user.id,
                            mapOf(
                                "marryStatus.marriedWith" to user.id,
                                "marryStatus.marriedDate" to marriedDate,
                                "userCakes.balance" to authorData.userCakes.balance - 6000
                            )
                        )

                        context.database.user.updateUser(
                            user.id,
                            mapOf(
                                "marryStatus.marriedWith" to context.event.user.id,
                                "marryStatus.marriedDate" to marriedDate,
                                "userCakes.balance" to userData.userCakes.balance - 6000
                            )
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
    }

    private fun isPremium(premiumDate: Instant?): Boolean {
        val currentEpoch = System.currentTimeMillis() / 1000
        return premiumDate?.epochSeconds?.let { it > currentEpoch } ?: false
    }
}