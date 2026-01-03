package net.cakeyfox.foxy.interactions.vanilla.social.marry

import dev.minn.jda.ktx.coroutines.await
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.components.buttons.ButtonStyle

class DivorceExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val marriageInfo = context.database.user.getMarriage(context.userId)

        if (marriageInfo == null) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["divorce.notMarried"])
            }
            return
        }


        val partnerUser = if (marriageInfo.firstUserId == context.user.id) {
            context.jda.retrieveUserById(marriageInfo.secondUserId).await()
        } else {
            context.jda.retrieveUserById(marriageInfo.firstUserId).await()
        }
        context.reply(true) {
            content = pretty(
                FoxyEmotes.FoxyCry,
                context.locale["divorce.confirm", partnerUser.globalName ?: partnerUser.name]
            )

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.DANGER,
                    FoxyEmotes.FoxyCry,
                    context.locale["divorce.confirmButton"]
                ) {
                    context.database.user.deleteMarriage(context.userId)

                    it.edit {
                        content = pretty(
                            FoxyEmotes.FoxyYay,
                            context.locale["divorce.success"]
                        )


                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                context.user,
                                ButtonStyle.SECONDARY,
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