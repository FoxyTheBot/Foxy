package net.cakeyfox.foxy.interactions.vanilla.social

import kotlinx.coroutines.withContext
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.image.profile.ProfileRender
import net.cakeyfox.foxy.image.ImageConfig
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.interaction.command.UserContextInteractionEvent
import net.dv8tion.jda.api.utils.FileUpload

class ProfileViewExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()

        val user = when (context.event) {
            is UserContextInteractionEvent -> (context.event as UserContextInteractionEvent).target
            else -> context.getOption("user", 0, User::class.java) ?: context.user
        }

        val userData = context.database.user.getFoxyProfile(user.id)

        if (userData.isBanned == true) {
            context.reply {
                embed {
                    title = pretty(
                        FoxyEmotes.FoxyRage,
                        context.locale["profile.isBanned", user.name]
                    )
                    color = Colors.RED
                    field {
                        name = pretty(
                            FoxyEmotes.FoxyDrinkingCoffee,
                            context.locale["profile.banReason"]
                        )
                        value = userData.banReason ?: context.locale["profile.noBanReasonProvided"]
                        inline = false
                    }

                    field {
                        name = pretty(
                            FoxyEmotes.FoxyBan,
                            context.locale["profile.bannedSince"]
                        )
                        value = userData.banDate?.let {
                            context.utils.convertISOToDiscordTimestamp(it)
                        }.toString()
                        inline = false
                    }
                }
            }
            return
        }

        val profile = withContext(context.foxy.coroutineDispatcher) {
            ProfileRender(
                ImageConfig(
                    1436,
                    884
                ),
                context
            ).create(user, userData)
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