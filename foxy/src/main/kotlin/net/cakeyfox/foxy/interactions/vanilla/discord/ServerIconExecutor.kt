package net.cakeyfox.foxy.interactions.vanilla.discord

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.ClusterUtils.getGuildInfo
import net.cakeyfox.foxy.utils.linkButton

class ServerIconExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val serverId = context.getOption("server_id", 0, String::class.java) ?: context.guild?.id

        if (serverId?.toLongOrNull() == null) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["server.info.invalidServerId"]
                )
            }

            return
        }

        val guildInfo = context.foxy.getGuildInfo(context.foxy, serverId.toLong())

        if (guildInfo == null) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["server.info.serverNotFound", serverId]
                )
            }

            return
        }
        if (guildInfo.icon == null) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["server.icon.noIcon"]
                )
            }

            return
        }

        context.reply {
            embed {
                title = guildInfo.name
                color = Colors.FOXY_DEFAULT
                image = guildInfo.icon + "?size=2048"
            }

            actionRow(
                linkButton(
                    emoji = FoxyEmotes.FoxyWow,
                    label = context.locale["user.avatar.showInBrowser"],
                    url = guildInfo.icon + "?size=2048"
                )
            )
        }
    }
}