package net.cakeyfox.foxy.interactions.vanilla.social

import kotlinx.coroutines.withContext
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.profile.ProfileRender
import net.cakeyfox.foxy.profile.config.ProfileConfig
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.utils.FileUpload

class ProfileViewExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val user = context.getOption<User>("user") ?: context.event.user
        val userData = context.database.user.getFoxyProfile(user.id)

        if (userData.isBanned == true) {
            context.reply {
                embed {
                    title = pretty(FoxyEmotes.FoxyRage, context.locale["profile.isBanned", user.name])
                    color = Colors.RED
                    field {
                        name = pretty(FoxyEmotes.FoxyDrinkingCoffee, context.locale["profile.banReason"])
                        value = userData.banReason ?: context.locale["profile.noBanReasonProvided"]
                        inline = false
                    }

                    field {
                        name = pretty(FoxyEmotes.FoxyBan, context.locale["profile.bannedSince"])
                        value = userData.banDate?.let { context.utils.convertISOToDiscordTimestamp(it) }.toString()
                        inline = false
                    }
                }
            }
            return
        }

        val profile = withContext(context.foxy.coroutineDispatcher) {
            ProfileRender(ProfileConfig(1436, 884), context).create(user, userData)
        }
        val file = FileUpload.fromData(profile, "profile.png")

        context.reply {
            content = pretty(
                FoxyEmotes.FoxyDrinkingCoffee,
                context.locale["profile.view", user.asMention]
            )

            files.plusAssign(file)
        }
    }
}