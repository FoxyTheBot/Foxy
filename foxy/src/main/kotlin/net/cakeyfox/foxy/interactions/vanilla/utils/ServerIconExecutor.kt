package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.ClusterUtils

class ServerIconExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val serverId = context.getOption<String>("server_id") ?: context.guild?.id

        if (serverId?.toLongOrNull() == null) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["server.info.invalidServerId"])
            }

            return
        }

        val guildInfo = ClusterUtils.getGuildInfo(context.foxy, serverId.toLong())

        if (guildInfo == null) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["server.info.serverNotFound", serverId])
            }

            return
        }
        if (guildInfo.icon == null) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["server.icon.noIcon"])
            }

            return
        }

        context.reply {
            embed {
                title = guildInfo.name
                color = Colors.FOXY_DEFAULT
                image = guildInfo.icon + "?size=2048"
            }
        }
    }
}