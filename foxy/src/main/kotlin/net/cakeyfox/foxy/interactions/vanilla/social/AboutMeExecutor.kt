package net.cakeyfox.foxy.interactions.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class AboutMeExecutor : UnleashedCommandExecutor( ){
    override suspend fun execute(context: CommandContext) {
        val text = context.getOption("text", 0, String::class.java, true)

       if (text != null) {
           context.database.user.updateUser(context.user.id) {
               userProfile.aboutme = text
           }

           context.reply {
               content = pretty(
                   FoxyEmotes.FoxyYay,
                   context.locale["aboutme.success", text]
               )
           }
       }
    }
}