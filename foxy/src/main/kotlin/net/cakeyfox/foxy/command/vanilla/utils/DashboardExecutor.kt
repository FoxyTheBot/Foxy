package net.cakeyfox.foxy.command.vanilla.utils

import dev.minn.jda.ktx.coroutines.await
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.Permission

class DashboardExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        if (context.guild == null) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["dashboard.guildNotFound"]
                )
            }

            return
        }

        val userAsMember = context.guild.retrieveMember(context.user).await()

        if (!userAsMember.hasPermission(Permission.MANAGE_SERVER)) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["dashboard.noPermission"]
                )
            }
        }

        context.reply(true) {
            embed {
                title = pretty(FoxyEmotes.FoxyYay, context.locale["dashboard.embed.title"])
                color = Colors.BLURPLE
                description = context.locale["dashboard.embed.description", context.guild.name]
            }

            actionRow(
                context.foxy.interactionManager.createLinkButton(
                    FoxyEmotes.FoxyYay,
                    context.locale["dashboard.embed.button"],
                    Constants.DASHBOARD_URL
                )
            )
        }
    }
}