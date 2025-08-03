package net.cakeyfox.foxy.interactions.commands

import dev.minn.jda.ktx.coroutines.await
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.vanilla.actions.declarations.RoleplayCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.StatusCommand
import net.cakeyfox.foxy.interactions.vanilla.economy.declarations.*
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.*
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.RussianRouletteCommand
import net.cakeyfox.foxy.interactions.vanilla.magic.declarations.MagicCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.AboutMeCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.BirthdayCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.DivorceCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.MarryCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.ProfileCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.DashboardCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.DblCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.HelpCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.PingCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.ServerCommand
import net.cakeyfox.foxy.utils.ClusterUtils
import net.dv8tion.jda.api.interactions.commands.Command
import java.util.UUID

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
            val globalCommandAction = if (foxy.currentCluster.isMasterCluster) shard.updateCommands() else null

            commands.forEach { command ->
                val builtCommand = command.create().build()

                if (command.create().isPrivate) {
                    if (shard.shardInfo.shardId == supportServerShardId) {
                        val supportServer = foxy.shardManager.getGuildById(Constants.SUPPORT_SERVER_ID)
                        supportServer?.updateCommands()?.addCommands(builtCommand)?.await()
                        logger.info { "Registered /${command.create().name} as private command (Shard: #${shard.shardInfo.shardId})" }
                    }
                } else {
                    globalCommandAction?.addCommands(builtCommand)
                }

                if (foxy.currentCluster.isMasterCluster) {
                    foxy.database.bot.getOrRegisterCommand(
                        net.cakeyfox.foxy.database.data.Command(
                            uniqueId = UUID.randomUUID().toString(),
                            name = command.create().name,
                            description = command.create().description,
                            supportsLegacy = false,
                            category = command.create().category,
                            usage = null,
                            usageCount = 0,
                            subCommands = builtCommand.subcommands.map {
                                net.cakeyfox.foxy.database.data.Command.SubCommand(
                                    uniqueId = UUID.randomUUID().toString(),
                                    name = it.name,
                                    description = it.description
                                )
                            }
                        )
                    )
                }
            }

            if (foxy.currentCluster.isMasterCluster && globalCommandAction != null) {
                val registeredCommands = globalCommandAction.await()
                allCommands.addAll(registeredCommands)
                logger.info { "${commands.count { !it.create().isPrivate }} commands registered on shard #${shard.shardInfo.shardId}" }
            }
        }

        return allCommands
    }


    init {
        /* ---- [Roleplay] ---- */
        register(RoleplayCommand())

        /* ---- [Economy] ---- */
        register(CakesCommand())
        register(DailyCommand())
        register(SlotsCommand())
//        register(RouletteCommand())

        /* ---- [Entertainment] ---- */
        register(MagicCommand())
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
        register(BirthdayCommand())

        /* ---- [Utils] ---- */
        register(HelpCommand())
        register(DblCommand())
        register(PingCommand())
        register(ServerCommand())
        register(DashboardCommand())

        /* ---- [Staff] ---- */
        register(StatusCommand())
    }
}
