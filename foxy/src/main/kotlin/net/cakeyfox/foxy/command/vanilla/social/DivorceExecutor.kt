package net.cakeyfox.foxy.command.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class DivorceExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        if (context.authorData.marryStatus.marriedWith == null) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["divorce.notMarried"]
                )
            }
            return
        }

        val partner = context.db.utils.user.getDiscordUser(
            context.authorData.marryStatus.marriedWith!!
        )
        val partnerAsUser = context.instance.helpers.getUserById(partner._id)

        context.reply(true) {
            content = pretty(
                FoxyEmotes.FoxyCry,
                context.locale["divorce.confirm", partnerAsUser.asMention]
            )

            actionRow(
                context.instance.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.DANGER,
                    FoxyEmotes.FoxyCry,
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

                    it.edit {
                        content = pretty(
                            FoxyEmotes.FoxyYay,
                            context.locale["divorce.success"]
                        )


                        actionRow(
                            context.instance.interactionManager.createButtonForUser(
                                context.user,
                                ButtonStyle.PRIMARY,
                                FoxyEmotes.FoxyCry,
                                context.locale["divorce.confirmButton"]
                            ) { }.asDisabled()
                        )
                    }
                }
            )
        }
    }
}