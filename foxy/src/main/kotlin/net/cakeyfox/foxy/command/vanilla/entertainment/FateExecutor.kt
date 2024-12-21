package net.cakeyfox.foxy.command.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor

class FateExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val fateList = listOf(
            context.locale["fate.couple"],
            context.locale["fate.friend"],
            context.locale["fate.enemy"],
            context.locale["fate.soulmate"],
            context.locale["fate.crush"],
            context.locale["fate.sibling"],
            context.locale["fate.parent"],
            context.locale["fate.married"],
        )

        val fate = fateList.random()

        context.reply {
            content = context.prettyResponse {
                content = context.prettyResponse {
                    emoteId = FoxyEmotes.FOXY_YAY
                    content = context.locale["fate.success", fate]
                }
            }
        }
    }
}