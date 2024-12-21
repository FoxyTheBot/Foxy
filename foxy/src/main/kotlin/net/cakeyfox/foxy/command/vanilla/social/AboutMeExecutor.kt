package net.cakeyfox.foxy.command.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor

class AboutMeExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val text = context.getOption<String>("text")!!

        if (text.length > 177) {
            context.reply {
                content = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_CRY
                    content = context.locale["aboutme.tooLong"]
                }
                return@reply
            }
        }

        context.db.utils.user.updateUser(
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