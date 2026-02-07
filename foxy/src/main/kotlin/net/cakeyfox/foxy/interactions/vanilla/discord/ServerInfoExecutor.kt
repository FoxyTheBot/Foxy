package net.cakeyfox.foxy.interactions.vanilla.discord

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.ClusterUtils.getGuildInfo

class ServerInfoExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val serverId = context.getOption("server_id", 0, String::class.java) ?: context.guild?.id

        if (serverId?.toLongOrNull() == null) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["server.info.invalidServerId"])
            }

            return
        }

        val guildInfo = context.foxy.getGuildInfo(context.foxy, serverId.toLong())

        if (guildInfo == null) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["server.info.serverNotFound", serverId])
            }

            return
        }

        context.reply {
            embed {
                title = pretty(
                    FoxyEmotes.FoxyWow,
                    guildInfo.name,
                    ""
                )

                thumbnail = guildInfo.icon ?: "https://cdn.discordapp.com/embed/avatars/0.png"
                color = Colors.FOXY_DEFAULT

                if (guildInfo.splashUrl != null) {
                    image = guildInfo.splashUrl + "?size=2048"
                }

                field {
                    name = pretty(
                        FoxyEmotes.FoxyIdPurple,
                        "ID",
                        ""
                    )
                    value = "`${guildInfo.id}`"
                }

                field {
                    name = pretty(
                        FoxyEmotes.FoxyHm,
                        context.locale["server.info.owner"],
                        ""
                    )
                    value = "`@${guildInfo.owner.username}` (`${guildInfo.owner.id}`)"
                }

                field {
                    name = pretty(
                        FoxyEmotes.FoxyNice,
                        context.locale["server.info.roles"],
                        ""
                    )
                    value = guildInfo.roleCount.toString()
                }

                field {
                    name = pretty(
                        FoxyEmotes.BOOST,
                        context.locale["server.info.boosts"],
                        ""
                    )
                    value = guildInfo.boostCount.toString()
                }

                field {
                    name = pretty(
                        FoxyEmotes.FoxyPlush,
                        context.locale["server.info.members"],
                        ""
                    )
                    value = guildInfo.memberCount.toString()
                }

                field {
                    name = pretty(
                        FoxyEmotes.FoxyBread,
                        context.locale["server.info.emojis"],
                        ""
                    )
                    value = guildInfo.emojiCount.toString()
                }

                field {
                    name = pretty(
                        FoxyEmotes.FoxyWow,
                        context.locale["server.info.channels"],
                        ""
                    )
                    value = """
                        ${context.locale["server.info.textChannels"]}: ${guildInfo.textChannelCount}
                        ${context.locale["server.info.voiceChannels"]}: ${guildInfo.voiceChannelCount}
                    """.trimIndent()
                }

                field {
                    name = pretty(
                        FoxyEmotes.FoxyCake,
                        context.locale["server.info.createdAt"],
                        ""
                    )
                    value = context.foxy.utils.convertLongToDiscordTimestamp(guildInfo.createdAt)
                }

                field {
                    name = pretty(
                        FoxyEmotes.FoxyHowdy,
                        context.locale["server.info.joinedAt"],
                        ""
                    )
                    value = context.foxy.utils.convertLongToDiscordTimestamp(guildInfo.joinedAt)
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