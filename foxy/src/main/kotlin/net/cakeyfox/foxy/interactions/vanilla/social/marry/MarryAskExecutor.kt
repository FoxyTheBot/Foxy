package net.cakeyfox.foxy.interactions.vanilla.social.marry

import dev.minn.jda.ktx.interactions.components.Container
import dev.minn.jda.ktx.interactions.components.Separator
import dev.minn.jda.ktx.interactions.components.TextDisplay
import dev.minn.jda.ktx.interactions.components.row
import dev.minn.jda.ktx.messages.InlineMessage
import kotlinx.coroutines.launch
import kotlinx.datetime.Instant
import kotlinx.datetime.toKotlinInstant
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.Type
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.componentMsg
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.components.separator.Separator
import net.dv8tion.jda.api.entities.Message
import net.dv8tion.jda.api.entities.User
import java.time.ZoneId
import java.time.ZonedDateTime
import java.util.EnumSet

class MarryAskExecutor : UnleashedCommandExecutor() {
    companion object {
        const val MARRIAGE_TAX = 6000
    }

    override suspend fun execute(context: CommandContext) {
        val user = context.getOption("user", 0, User::class.java) ?: return
        val proposalText = context.getOption("proposal", 0, String::class.java, true)

        if (user.id == context.user.id) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["marry.cantMarryYourself"])
            }
            return
        }

        if (user.isBot) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["marry.cantMarryBot", user.asMention])
            }
            return
        }

        if (user.id == context.jda.selfUser.id) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["marry.cantMarryMe"])
            }
            return
        }

        val userData = context.database.user.getFoxyProfile(user.id)
        val authorData = context.getAuthorData()
        val userMarriageState = context.database.user.getMarriage(user.id)
        val authorMarriageState = context.database.user.getMarriage(context.user.id)

        if (authorData.marryStatus.cantMarry) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["marry.userCantMarry"])
            }
            return
        }

        if (userMarriageState != null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["marry.userAlreadyMarried"])
            }
            return
        }

        if (authorMarriageState != null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["marry.youAlreadyMarried"])
            }
            return
        }

        val isAuthorPremium = isPremium(authorData.userPremium.premiumDate)

        if (!isAuthorPremium) {
            if (authorData.userCakes.balance < MARRIAGE_TAX) {
                context.reply(true) {
                    content = pretty(FoxyEmotes.FoxyCry, context.locale["marry.authorHasNoCakes"])
                }
                return
            }
            if (userData.userCakes.balance < MARRIAGE_TAX) {
                context.reply(true) {
                    content = pretty(FoxyEmotes.FoxyCry, context.locale["marry.userHasNoCakes", user.asMention])
                }
                return
            }
        }

        context.reply {
            marriageMessage(context, proposalText)
        }
    }

    private fun mergeNames(vararg names: String): String {
        return buildString {
            for (name in names) {
                val clean = name.trim()
                if (clean.isEmpty()) continue

                val partSize = when {
                    clean.length <= 3 -> 1
                    clean.length <= 6 -> 2
                    else -> 3
                }

                append(clean.take(partSize))
            }
        }
    }

    private fun InlineMessage<*>.marriageMessage(
        context: CommandContext,
        proposalText: String?,
        isDisabled: Boolean = false
    ) {
        context.foxy.tasksScope.launch {
            val user = context.getOption("user", 0, User::class.java) ?: return@launch
            val authorData = context.getAuthorData()
            val isAuthorPremium = isPremium(authorData.userPremium.premiumDate)
            val shouldCharge = !isAuthorPremium

            useComponentsV2 = true

            components += Container {
                accentColor = Colors.FOXY_DEFAULT

                +TextDisplay(componentMsg(Type.SMALL_HEADER, context.locale["marry.proposal"], FoxyEmotes.Ring))
                if (!isDisabled) {
                    +TextDisplay(context.locale["marry.proposalDescription", user.asMention, context.user.asMention])
                } else {
                    +TextDisplay(context.locale["marry.accepted"])
                }

                if (proposalText != null) {
                    +Separator(true, Separator.Spacing.SMALL)
                    +TextDisplay(componentMsg(Type.SMALL_HEADER, context.locale["marry.requestField"]))
                    +TextDisplay(proposalText)
                }

                +Separator(true, Separator.Spacing.SMALL)
                +row(
                    context.foxy.interactionManager.createButtonForUser(
                        user,
                        ButtonStyle.SUCCESS,
                        FoxyEmotes.FoxyCake,
                        context.locale["marry.acceptButton"],
                    ) {
                        if (shouldCharge) {
                            val authorBalance = authorData.userCakes.balance
                            val userBalance = context.database.user.getFoxyProfile(user.id).userCakes.balance

                            if (authorBalance < MARRIAGE_TAX || userBalance < MARRIAGE_TAX) {
                                it.reply(true) {
                                    content = pretty(FoxyEmotes.FoxyCry, context.locale["marry.notEnoughCakesAnymore"])
                                }
                                return@createButtonForUser
                            }
                        }

                        if (shouldCharge) {
                            context.database.user.updateUser(context.user.id) {
                                userCakes.removeCakes(MARRIAGE_TAX.toLong())
                            }

                            context.database.user.updateUser(user.id) {
                                userCakes.removeCakes(MARRIAGE_TAX.toLong())
                            }
                        }


                        context.database.user.createMarriage(
                            context.user.id,
                            user.id,
                            mergeNames(context.user.effectiveName, user.effectiveName)
                        )
                        it.edit {
                            marriageMessage(context, proposalText, true)
                        }
                    }.withDisabled(isDisabled)
                )
            }

            allowedMentionTypes = EnumSet.of(Message.MentionType.USER)
        }
    }

    private fun isPremium(premiumDate: Instant?): Boolean {
        val currentEpoch = System.currentTimeMillis() / 1000
        return premiumDate?.epochSeconds?.let { it > currentEpoch } ?: false
    }
}