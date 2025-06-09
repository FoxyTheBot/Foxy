package net.cakeyfox.foxy.interactions.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User

class FateExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user")!!

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
            content = pretty(
                FoxyEmotes.FoxyYay,
                context.locale["fate.onAParallelUniverse", user.asMention, fate]
            )
        }
    }
}