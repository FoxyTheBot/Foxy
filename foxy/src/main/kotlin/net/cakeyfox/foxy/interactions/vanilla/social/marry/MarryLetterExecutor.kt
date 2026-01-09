package net.cakeyfox.foxy.interactions.vanilla.social.marry

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.interactions.components.Container
import dev.minn.jda.ktx.interactions.components.TextDisplay
import kotlinx.datetime.Clock
import kotlinx.datetime.toLocalDateTime
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.Type
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.componentMsg
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.components.buttons.ButtonStyle

class MarryLetterExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val itemId = context.getOption("letter_type", 0, String::class.java) ?: return
        val letterText = context.getOption("letter", 1, String::class.java) ?: return
        val isMarried = context.database.user.getMarriage(context.userId) != null
        val marriageInfo = context.database.user.getMarriage(context.userId)!!
        val userInfoAsMarried = if (marriageInfo.firstUser.id == context.user.id) {
            marriageInfo.firstUser
        } else {
            marriageInfo.secondUser
        }

        if (!isMarried) {
            context.reply(true) {
                content = context.locale["marry.store.youAreNotMarried"]
            }
            return
        }

        val storeItem = context.database.user.getItemFromCoupleShop(itemId) ?: return

        if (context.getAuthorData().userCakes.balance < storeItem.price) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["marry.letter.youHaveNoCakes"]
                )
            }
            return
        }

        val now = Clock.System.now().toLocalDateTime(context.foxy.foxyZone).date
        val lastSentLetter = userInfoAsMarried.lastLetter?.toLocalDateTime(context.foxy.foxyZone)?.date

        context.reply(true) {
            embed {
                color = Colors.FOXY_DEFAULT
                title = pretty(
                    FoxyEmotes.Letter,
                    context.locale["marry.letter.sendLoveLetter.title"]
                )
                description = """
                    > $letterText
                    
                    ${context.locale["marry.letter.tip", storeItem.card.affinityPoints.toString()]}
                """.trimIndent()
            }

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    targetUser = context.user,
                    style = ButtonStyle.PRIMARY,
                    emoji = FoxyEmotes.Letter,
                    label = if (lastSentLetter != null && lastSentLetter > now) {
                        context.locale[
                            "marry.letter.sendLoveLetter.button",
                            context.utils.formatLongNumber(storeItem.price.toLong())
                        ]
                    } else {
                        context.locale[
                            "marry.letter.sendLoveLetter.sendLetterWithoutAffinityPoints",
                            context.utils.formatLongNumber(storeItem.price.toLong())
                        ]
                    }
                ) {
                    it.deferEdit()
                    val marriedWith = if (marriageInfo.firstUser.id == context.user.id) {
                        context.foxy.shardManager.retrieveUserById(marriageInfo.secondUser.id).await()
                    } else {
                        context.foxy.shardManager.retrieveUserById(marriageInfo.firstUser.id).await()
                    }


                    context.database.user.updateMarriage(context.user.id) {
                        if (marriageInfo.firstUser.id == context.user.id) {
                            incFirstUserLetters()
                            lastFirstUserLetter = Clock.System.now()
                        } else {
                            incSecondUserLetters()
                            lastSecondUserLetter = Clock.System.now()
                        }

                        if (lastSentLetter != null) {
                            if (lastSentLetter > now) {
                                incAffinityPoints(storeItem.card.affinityPoints)
                            }
                        }
                    }

                    if (storeItem.price != 0) {
                        context.database.user.removeCakesFromUser(
                            context.user.id,
                            storeItem.price.toLong()
                        )
                    }

                    it.edit {
                        embed {
                            color = Colors.FOXY_DEFAULT
                            title = pretty(
                                FoxyEmotes.Letter,
                                context.locale["marry.letter.sendLoveLetter.title"]
                            )
                            description = """
                    > $letterText
                    
                    Envie uma cartinha com esse tipo de carta e ganhe **${storeItem.card.affinityPoints} Pontos de Afinidade**
                """.trimIndent()
                        }

                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                targetUser = context.user,
                                style = ButtonStyle.PRIMARY,
                                emoji = FoxyEmotes.Letter,
                                label = context.locale[
                                    "marry.letter.sendLoveLetter.button",
                                    context.utils.formatLongNumber(storeItem.price.toLong())
                                ]

                            ) { }.asDisabled()
                        )
                    }


                    context.utils.sendDirectMessage(marriedWith) {
                        useComponentsV2 = true

                        components += Container {
                            accentColor = Colors.FOXY_DEFAULT

                            +TextDisplay(
                                componentMsg(
                                    Type.SMALL_HEADER,
                                    context.locale["marry.manager.youReceivedALoveLetter"],
                                    FoxyEmotes.Letter
                                )
                            )

                            +TextDisplay(
                                "> $letterText \n**- ${context.user.asMention}**"
                            )
                        }
                    }
                }
            )
        }
    }
}