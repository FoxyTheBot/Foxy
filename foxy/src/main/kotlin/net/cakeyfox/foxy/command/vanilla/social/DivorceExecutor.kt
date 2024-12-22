package net.cakeyfox.foxy.command.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class DivorceExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        if (context.authorData.marryStatus.marriedWith == null) {
            context.reply {
                content = context.prettyResponse {
                    content = context.locale["divorce.notMarried"]
                }
            }
            return
        }

        val partner = context.db.utils.user.getDiscordUser(
            context.authorData.marryStatus.marriedWith!!
        )
        val partnerAsUser = context.instance.helpers.getUserById(partner._id)

        context.reply(true) {
            content = context.prettyResponse {
                emoteId = FoxyEmotes.FOXY_CRY
                content = context.locale["divorce.confirm", "<@!${partnerAsUser.id}>"]
            }

            actionRow(
                context.instance.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.DANGER,
                    context.jda.getEmojiById(FoxyEmotes.FOXY_CRY),
                    context.locale["divorce.confirmButton"]
                ) {
                    context.db.utils.user.updateUsers(
                        listOf(
                            context.authorData,
                            partner
                        ),
                        mapOf(
                            "marryStatus.marriedWith" to null,
                            "marryStatus.marriedDate" to null
                        )
                    )

                    it.reply {
                        content = context.prettyResponse {
                            emoteId = FoxyEmotes.FOXY_YAY
                            content = context.locale["divorce.success"]

                            actionRow(
                                context.instance.interactionManager.createButtonForUser(
                                    context.user,
                                    ButtonStyle.PRIMARY,
                                    context.jda.getEmojiById(FoxyEmotes.FOXY_CRY),
                                    context.locale["divorce.confirmButton"]
                                ) { }.asDisabled()
                            )
                        }
                    }
                }
            )
        }
    }
}