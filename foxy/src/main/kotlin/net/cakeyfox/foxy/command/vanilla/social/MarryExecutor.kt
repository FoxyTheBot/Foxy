package net.cakeyfox.foxy.command.vanilla.social

import kotlinx.datetime.Clock
import kotlinx.datetime.toJavaInstant
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle
import java.util.Date

class MarryExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user")!!

        if (user == null) {
            context.reply {
                content = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_CRY
                    content = context.locale["marry.youNeedToMentionAUser"]
                }
            }

            return
        }

        if (user.id == context.event.user.id) {
            context.reply {
                content = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_CRY
                    content = context.locale["marry.cantMarryYourself"]
                }
            }

            return
        }

        if (user.id == context.instance.jda.selfUser.id) {
            context.reply {
                content = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_CRY
                    content = context.locale["marry.cantMarryMe"]
                }
            }

            return
        }

        val userData = context.db.utils.user.getDiscordUser(user.id)

        if (userData.marryStatus.marriedWith != null) {
            context.reply {
                content = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_CRY
                    content = context.locale["marry.userAlreadyMarried"]
                }
            }

            return
        }

        if (context.authorData.marryStatus.marriedWith != null) {
            context.reply {
                content = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_CRY
                    content = context.locale["marry.youAlreadyMarried"]
                }
            }

            return
        }

        context.reply {
            content = context.prettyResponse {
                unicodeEmote = FoxyEmotes.RING
                content = context.locale["marry.proposal", user.asMention]
            }

            actionRow(
                context.instance.interactionManager.createButtonForUser(
                    user,
                    ButtonStyle.SUCCESS,
                    context.jda.getEmojiById(FoxyEmotes.FOXY_CUPCAKE)!!,
                    context.locale["marry.accept"],
                ) {
                    context.db.utils.user.updateUser(
                        context.event.user.id,
                        mapOf(
                            "marryStatus.marriedWith" to user.id,
                            "marryStatus.marriedDate" to Date.from(Clock.System.now().toJavaInstant())
                        )
                    )

                    context.db.utils.user.updateUser(
                        user.id,
                        mapOf(
                            "marryStatus.marriedWith" to context.event.user.id,
                            "marryStatus.marriedDate" to Date.from(Clock.System.now().toJavaInstant())
                        )
                    )

                    it.edit {
                        content = context.prettyResponse {
                            unicodeEmote = FoxyEmotes.RING
                            content = context.locale["marry.accepted", user.asMention]
                        }

                        actionRow(
                            context.instance.interactionManager.createButtonForUser(
                                user,
                                ButtonStyle.SUCCESS,
                                context.jda.getEmojiById(FoxyEmotes.FOXY_CUPCAKE)!!,
                                context.locale["marry.acceptedButton"]
                            ) { }.asDisabled()
                        )
                    }
                }
            )
        }
    }
}