package net.cakeyfox.foxy.interactions.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class AboutMeExecutor : FoxySlashCommandExecutor( ){
    override suspend fun execute(context: FoxyInteractionContext) {
        val text = context.getOption<String>("text")!!

        if (text.length > 177) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["aboutme.tooLong"]
                )
            }

            return
        }

        context.database.user.updateUser(
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