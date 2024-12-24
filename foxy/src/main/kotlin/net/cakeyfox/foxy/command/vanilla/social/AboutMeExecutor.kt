package net.cakeyfox.foxy.command.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty

class AboutMeExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val text = context.getOption<String>("text")!!

        if (text.length > 177) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["aboutme.tooLong"]
                )
                return@reply
            }
        }

        context.db.utils.user.updateUser(
            context.event.user.id,
            mapOf("userProfile.aboutme" to text)
        )

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyYay,
                context.locale["aboutme.success", text]
            )
        }
    }
}