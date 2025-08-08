package net.cakeyfox.foxy.interactions.vanilla.social

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty

class AboutMeExecutor : UnleashedCommandExecutor( ){
    override suspend fun execute(context: CommandContext) {
        val text = context.getOption("text", 0, String::class.java, true)

       if (text != null) {
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
               context.user.id,
               mapOf("userProfile.aboutme" to text)
           )

           context.reply {
               content = pretty(
                   FoxyEmotes.FoxyYay,
                   context.locale["aboutme.success", text]
               )
           }
       } else null
    }
}