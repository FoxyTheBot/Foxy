package net.cakeyfox.foxy.command.vanilla.dev

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.ClusterUtils
import net.cakeyfox.foxy.utils.pretty

class ServerInviteRetrieveExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer(true)

        val serverId = context.getOption<String>("server_id") ?: return
        val guild = ClusterUtils.getGuildInfo(context.foxy, serverId.toLong())
        if (context.guild?.id != Constants.SUPPORT_SERVER_ID) return

        if (guild == null) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, "Servidor não encontrado!")
            }
            return
        }

        if (context.guild.id != Constants.SUPPORT_SERVER_ID) return
        val invites = guild.invites.map { it }

        context.reply(true) {
            embed {
                title = "Convites do servidor ${guild.name}"
                thumbnail = guild.icon
                color = Colors.RANDOM
                description = invites.take(5)
                    .joinToString("\n") {
                        "${it.url} - ${it.uses}/${it.maxUses} - Criado por ${it.createdBy.name} (`${it.createdBy.id}`)"
                    }
            }
        }
    }
}