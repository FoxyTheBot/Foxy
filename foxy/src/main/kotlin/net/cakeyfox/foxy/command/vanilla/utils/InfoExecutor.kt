package net.cakeyfox.foxy.command.vanilla.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.UnleashedCommandContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import java.util.*

class InfoExecutor: FoxySlashCommandExecutor() {
    override suspend fun execute(context: UnleashedCommandContext) {

        context.reply {
            embed {
                title = context.makeReply(FoxyEmotes.FOXY_HOWDY, "Informações avançadas da Foxy")
                thumbnail = context.instance.jda.selfUser.effectiveAvatarUrl

                field {
                    name = context.makeReply(FoxyEmotes.KOTLIN, "Kotlin Version")
                    value = KotlinVersion.CURRENT.toString()
                    inline = false
                }

                field {
                    name = context.makeReply(FoxyEmotes.JAVA, "Java Version")
                    value = System.getProperties().getProperty("java.version")
                    inline = false
                }

                field {
                    name = context.makeReply(FoxyEmotes.FOXY_CUPCAKE, "Guilds em cache")
                    value = context.instance.jda.guildCache.size().toString()
                    inline = false
                }

                field {
                    name = context.makeReply(FoxyEmotes.FOXY_PRAY, "Usuários em cache")
                    value = context.instance.jda.userCache.size().toString()
                    inline = false
                }

                field {
                    name = context.makeReply(FoxyEmotes.FOXY_OK, "Shards")
                    value = context.instance.jda.shardInfo.shardTotal.toString()
                    inline = false
                }

                field {
                    name = context.makeReply(FoxyEmotes.CONNECTED, "Hostname")
                    value = System.getenv("COMPUTERNAME").lowercase(Locale.getDefault())
                    inline = false
                }
            }
        }
    }
}