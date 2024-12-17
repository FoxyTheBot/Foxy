package net.cakeyfox.foxy.command.vanilla.social

import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import net.cakeyfox.foxy.utils.FoxyProfileRender
import net.dv8tion.jda.api.utils.FileUpload

class ProfileViewExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {
        context.defer()

        val user = context.event.getOption("user")?.asUser ?: context.event.user

        val profile = FoxyProfileRender().create(context, user)
        val file = FileUpload.fromData(profile.readBytes(), "profile.png")

        context.reply {
            files.plusAssign(file)
        }
    }
}