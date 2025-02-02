package net.cakeyfox.foxy.command.vanilla.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.ClusterUtils
import net.cakeyfox.foxy.utils.pretty

class ServerInfoExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val serverId = context.getOption<String>("server_id") ?: context.guild!!.id
        if (serverId.toLongOrNull() == null) {
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

        context.reply {
            embed {
                title = guildInfo.name

                thumbnail = guildInfo.icon ?: "https://cdn.discordapp.com/embed/avatars/0.png"

                if (guildInfo.splashUrl != null) {
                    image = guildInfo.splashUrl + "?size=2048"
                }

                field {
                    name = "ID"
                    value = guildInfo.id.toString()
                }

                field {
                    name = context.locale["server.info.owner"]
                    value = "${guildInfo.owner.username} (${guildInfo.owner.id})"
                }

                field {
                    name = context.locale["server.info.members"]
                    value = guildInfo.memberCount.toString()
                }

                field {
                    name = context.locale["server.info.channels"]
                    value = """
                        ${context.locale["server.info.textChannels"]}: ${guildInfo.textChannelCount}
                        ${context.locale["server.info.voiceChannels"]}: ${guildInfo.voiceChannelCount}
                    """.trimIndent()
                }

                field {
                    name = context.locale["server.info.roles"]
                    value = guildInfo.roleCount.toString()
                }

                field {
                    name = context.locale["server.info.emojis"]
                    value = guildInfo.emojiCount.toString()
                }

                field {
                    name = context.locale["server.info.createdAt"]
                    value = context.foxy.utils.convertLongToDiscordTimestamp(guildInfo.createdAt)
                }

                field {
                    name = context.locale["server.info.joinedAt"]
                    value = context.foxy.utils.convertLongToDiscordTimestamp(guildInfo.joinedAt)
                }

                field {
                    name = context.locale["server.info.boosts"]
                    value = guildInfo.boostCount.toString()
                }

                if (guildInfo.firstEmojis.isNotEmpty()) {
                    field {
                        name = context.locale["server.info.firstEmojis"]
                        value = guildInfo.firstEmojis.joinToString(" ")
                    }
                }

                footer {
                    name = context.locale[
                        "server.info.cluster",
                        guildInfo.clusterInfo.id.toString(),
                        guildInfo.clusterInfo.name,
                        guildInfo.shardId.toString()
                    ]
                }
            }
        }
    }
}