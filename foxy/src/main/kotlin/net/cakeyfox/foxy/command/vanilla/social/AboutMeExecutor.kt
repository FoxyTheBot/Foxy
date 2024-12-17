package net.cakeyfox.foxy.command.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor

class AboutMeExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        val text = context.event.getOption("text")!!.asString

        if (text.length > 177) {
            context.reply {
                content = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_CRY
                    content = context.locale["aboutme.tooLong"]
                }
                return@reply
            }
        }

        context.db.userUtils.updateUser(
            context.event.user.id,
            mapOf("userProfile.aboutme" to text)
        )

        context.reply {
           content = context.prettyResponse {
                emoteId = FoxyEmotes.FOXY_YAY
                content = context.locale["aboutme.success", text]
            }
        }
    }
}