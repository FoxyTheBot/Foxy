package net.cakeyfox.foxy.interactions.vanilla.entertainment

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User

class FateExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val user = context.getOption("user", 0, User::class.java)
        if (user == null) return

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