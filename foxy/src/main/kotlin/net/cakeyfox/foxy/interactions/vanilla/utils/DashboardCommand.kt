package net.cakeyfox.foxy.interactions.vanilla.utils

import dev.minn.jda.ktx.coroutines.await
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.linkButton
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class DashboardCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand(name = "dashboard", CommandCategory.UTILS) {
        interactionContexts = listOf(InteractionContextType.GUILD)
        integrationType = listOf(IntegrationType.GUILD_INSTALL)

        executor = DashboardExecutor()
    }

    inner class DashboardExecutor : FoxySlashCommandExecutor() {
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
                    linkButton(
                        FoxyEmotes.FoxyYay,
                        context.locale["dashboard.embed.button"],
                        Constants.DASHBOARD_URL
                    )
                )
            }
        }
    }
}