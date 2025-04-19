package net.cakeyfox.foxy.command

import dev.minn.jda.ktx.coroutines.await
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.actions.declarations.ActionsCommand
import net.cakeyfox.foxy.command.vanilla.dev.declarations.ServerInviteCommand
import net.cakeyfox.foxy.command.vanilla.dev.declarations.StatusCommand
import net.cakeyfox.foxy.command.vanilla.economy.declarations.*
import net.cakeyfox.foxy.command.vanilla.entertainment.declarations.*
import net.cakeyfox.foxy.command.vanilla.games.declarations.RussianRouletteCommand
import net.cakeyfox.foxy.command.vanilla.social.declarations.*
import net.cakeyfox.foxy.command.vanilla.utils.declarations.*
import net.cakeyfox.foxy.utils.ClusterUtils
import net.dv8tion.jda.api.interactions.commands.Command

class FoxyCommandManager(private val foxy: FoxyInstance) {
    val commands = mutableListOf<FoxyCommandDeclarationWrapper>()
    private val logger = KotlinLogging.logger { }

    operator fun get(name: String): FoxyCommandDeclarationWrapper? {
        return commands.find { it.create().name == name }
    }

    private fun register(command: FoxyCommandDeclarationWrapper) {
        commands.add(command)
    }

    suspend fun handle(): MutableList<Command> {
        val allCommands = mutableListOf<Command>()

        val supportServerShardId = ClusterUtils.getShardIdFromGuildId(
            Constants.SUPPORT_SERVER_ID.toLong(),
            foxy.config.discord.totalShards
        )

        foxy.shardManager.shards.forEach { shard ->
            val action = shard.updateCommands()

            commands.forEach { command ->
                if (command.create().isPrivate) {
                    if (shard.shardInfo.shardId == supportServerShardId) {
                        val supportServer = foxy.shardManager.getGuildById(Constants.SUPPORT_SERVER_ID)

                        supportServer?.updateCommands()?.addCommands(command.create().build())?.await()
                        logger.info { "Registered /${command.create().name} as private command (Shard: #${shard.shardInfo.shardId})" }                    }
                } else {
                    action.addCommands(command.create().build())
                }
            }

            val registeredCommands = action.await()
            allCommands.addAll(registeredCommands)
            logger.info { "${commands.size} commands registered on shard #${shard.shardInfo.shardId}" }
        }

        return allCommands
    }


    init {
        /* ---- [Roleplay] ---- */
        register(ActionsCommand())

        /* ---- [Economy] ---- */
        register(CakesCommand())
        register(DailyCommand())
        register(SlotsCommand())
//        register(RouletteCommand())
        register(RobCommand())

        /* ---- [Entertainment] ---- */
        register(FunCommand())
        register(AskFoxyCommand())
        register(FateCommand())
        register(CancelCommand())
        register(RateWaifuCommand())
        register(RussianRouletteCommand())

        /* ---- [Social] ---- */
        register(AboutMeCommand())
        register(ProfileCommand())
        register(MarryCommand())
        register(DivorceCommand())

        /* ---- [Utils] ---- */
        register(HelpCommand())
        register(DblCommand())
        register(PingCommand())
        register(ServerCommand())
        register(DashboardCommand())

        /* ---- [Staff] ---- */
        register(ServerInviteCommand())
        register(StatusCommand())
    }
}
