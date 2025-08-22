package net.cakeyfox.foxy.interactions.commands

import dev.minn.jda.ktx.coroutines.await
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.vanilla.actions.declarations.RoleplayCommand
import net.cakeyfox.foxy.interactions.vanilla.economy.declarations.*
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.*
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.RussianRouletteCommand
import net.cakeyfox.foxy.interactions.vanilla.magic.declarations.MagicCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.BirthdayCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.DivorceCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.MarryCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.ProfileCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.DashboardCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.DblCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.HelpCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.LanguageCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.FoxyCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.ServerCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.UserCommand
import net.cakeyfox.foxy.utils.ClusterUtils.getShardIdFromGuildId
import net.dv8tion.jda.api.interactions.commands.Command
import java.util.UUID

class FoxyCommandManager(private val foxy: FoxyInstance) {
    val commands = mutableListOf<FoxyCommandDeclarationWrapper>()
    private val logger = KotlinLogging.logger { }

    operator fun get(name: String): FoxyCommandDeclarationWrapper? {
        return commands.find { it.create().name == name }
    }

    fun getCommandAsLegacy(commandName: String): net.cakeyfox.foxy.interactions.commands.FoxyCommand? {
        commands.forEach { wrapper ->
            val cmd = wrapper.create()

            cmd.subCommands.forEach { subCmd ->
                if (subCmd.name.equals(commandName, ignoreCase = true) || subCmd.aliases.any {
                        it.equals(commandName, ignoreCase = true)
                    }) {
                    return FoxyCommand(subCmd.executor ?: cmd.executor, subCmd)
                }
            }

            if (cmd.name.equals(commandName, ignoreCase = true) || cmd.aliases.any {
                    it.equals(commandName, ignoreCase = true)
                }) {
                if (cmd.executor != null) {
                    return FoxyCommand(cmd.executor, cmd)
                }
            }
        }
        return null
    }


    private fun register(command: FoxyCommandDeclarationWrapper) {
        commands.add(command)
    }

    suspend fun handle(): MutableList<Command> {
        val allCommands = mutableListOf<Command>()

        val supportServerShardId = getShardIdFromGuildId(
            Constants.SUPPORT_SERVER_ID.toLong(),
            foxy.config.discord.totalShards
        )

        foxy.shardManager.shards.forEach { shard ->
            val globalCommandAction = if (foxy.currentCluster.isMasterCluster) shard.updateCommands() else null

            commands.forEach { command ->
                val createdCommand = command.create()
                val builtCommand = createdCommand.build()

                if (createdCommand.isPrivate) {
                    if (shard.shardInfo.shardId != supportServerShardId) return@forEach

                    foxy.shardManager.getGuildById(Constants.SUPPORT_SERVER_ID)
                        ?.updateCommands()
                        ?.addCommands(builtCommand)
                        ?.await()

                    logger.info { "Registered /${createdCommand.name} as private command (Shard: #${shard.shardInfo.shardId})" }
                } else {
                    globalCommandAction?.addCommands(builtCommand)
                }

                if (foxy.currentCluster.isMasterCluster) {
                    foxy.database.bot.getOrRegisterCommand(
                        net.cakeyfox.foxy.database.data.Command(
                            uniqueId = UUID.randomUUID().toString(),
                            name = createdCommand.name,
                            description = createdCommand.description,
                            supportsLegacy = createdCommand.supportsLegacy,
                            aliases = createdCommand.aliases,
                            category = createdCommand.category,
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
        register(ProfileCommand())
        register(MarryCommand())
        register(DivorceCommand())
        register(BirthdayCommand())

        /* ---- [Utils] ---- */
        register(HelpCommand())
        register(DblCommand())
        register(FoxyCommand())
        register(ServerCommand())
        register(DashboardCommand())
        register(LanguageCommand())
        register(UserCommand())
    }
}
