package net.cakeyfox.foxy.command.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor

class AboutMeExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        val text = context.event.getOption("text")!!.asString

        if (text.length > 177) {
            context.reply {
                content = context.makeReply(
                    FoxyEmotes.FOXY_CRY,
                    context.locale["aboutme.tooLong"]
                )
            }

            return
        }

        context.db.userUtils.updateUser(
            context.event.user.id,
            mapOf("userProfile.aboutme" to text)
        )

        context.reply {
            content = context.makeReply(FoxyEmotes.FOXY_YAY,
                context.locale["aboutme.success", text]
            )
        }
    }
}