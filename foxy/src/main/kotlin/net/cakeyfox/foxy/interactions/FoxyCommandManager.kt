package net.cakeyfox.foxy.interactions

import dev.minn.jda.ktx.coroutines.await
import mu.KotlinLogging
import net.cakeyfox.common.Constants
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.interactions.commands.FoxyCommandUnleashed
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.actions.declarations.RoleplayCommand
import net.cakeyfox.foxy.interactions.vanilla.discord.declarations.DashboardCommand
import net.cakeyfox.foxy.interactions.vanilla.discord.declarations.DblCommand
import net.cakeyfox.foxy.interactions.vanilla.discord.declarations.ServerCommand
import net.cakeyfox.foxy.interactions.vanilla.discord.declarations.UserCommand
import net.cakeyfox.foxy.interactions.vanilla.economy.declarations.CakesCommand
import net.cakeyfox.foxy.interactions.vanilla.economy.declarations.DailyCommand
import net.cakeyfox.foxy.interactions.vanilla.economy.declarations.SlotsCommand
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.AskFoxyCommand
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.CancelCommand
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.FateCommand
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.RateWaifuCommand
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.RollsCommand
import net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations.RussianRouletteCommand
import net.cakeyfox.foxy.interactions.vanilla.magic.declarations.MagicCommand
import net.cakeyfox.foxy.interactions.vanilla.music.declarations.NowPlayingCommand
import net.cakeyfox.foxy.interactions.vanilla.music.declarations.PauseCommand
import net.cakeyfox.foxy.interactions.vanilla.music.declarations.PlayCommand
import net.cakeyfox.foxy.interactions.vanilla.music.declarations.QueueCommand
import net.cakeyfox.foxy.interactions.vanilla.music.declarations.SkipCommand
import net.cakeyfox.foxy.interactions.vanilla.music.declarations.StopCommand
import net.cakeyfox.foxy.interactions.vanilla.music.declarations.VolumeCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.BirthdayCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.DivorceCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.MarryCommand
import net.cakeyfox.foxy.interactions.vanilla.social.declarations.ProfileCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.FoxyCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.HelpCommand
import net.cakeyfox.foxy.interactions.vanilla.utils.declarations.LanguageCommand
import net.cakeyfox.foxy.interactions.vanilla.youtube.declarations.YouTubeCommand
import net.cakeyfox.foxy.utils.ClusterUtils
import net.dv8tion.jda.api.interactions.commands.Command
import java.util.UUID

class FoxyCommandManager(private val foxy: FoxyInstance) {
    val commands = mutableListOf<FoxyCommandDeclarationWrapper>()
    private val logger = KotlinLogging.logger { }

    operator fun get(name: String): FoxyCommandDeclarationWrapper? {
        return commands.find { it.create().name == name }
    }

    fun getCommandAsLegacy(commandName: String): FoxyCommandUnleashed? {
        commands.forEach { wrapper ->
            val cmd = wrapper.create()

            cmd.subCommands.forEach { subCmd ->
                if (subCmd.name.equals(commandName, ignoreCase = true) || subCmd.aliases.any {
                        it.equals(commandName, ignoreCase = true)
                    }) {
                    return FoxyCommandUnleashed(subCmd.executor ?: cmd.executor, subCmd)
                }
            }

            if (cmd.name.equals(commandName, ignoreCase = true) || cmd.aliases.any {
                    it.equals(commandName, ignoreCase = true)
                }) {
                if (cmd.executor != null) {
                    return FoxyCommandUnleashed(cmd.executor, cmd)
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

        val supportServerShardId = ClusterUtils.getShardIdFromGuildId(
            Constants.SUPPORT_SERVER_ID.toLong(),
            foxy.config.discord.totalShards
        )

        foxy.shardManager.shards.forEach { shard ->
            val action = shard.updateCommands()

            commands.forEach { command ->
                val builtCommand = command.create().build()

                if (command.create().isPrivate) {
                    if (shard.shardInfo.shardId == supportServerShardId) {
                        val supportServer = foxy.shardManager.getGuildById(Constants.SUPPORT_SERVER_ID)
                        supportServer?.updateCommands()?.addCommands(builtCommand)?.await()
                        logger.info { "Registered /${command.create().name} as private command (Shard: #${shard.shardInfo.shardId})" }
                    }
                } else {
                    action.addCommands(builtCommand)
                }

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
                    ))
            }

            val registeredCommands = action.await()
            allCommands.addAll(registeredCommands)
            logger.info { "${commands.size} commands registered on shard #${shard.shardInfo.shardId}" }
        }

        return allCommands
    }


    init {
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
        register(RollsCommand())
        register(YouTubeCommand())

        /* ---- [Social] ---- */
        register(ProfileCommand())
        register(MarryCommand())
        register(DivorceCommand())
        register(BirthdayCommand())
        register(RoleplayCommand())

        /* ---- [Music] ---- */
        register(PlayCommand())
        register(SkipCommand())
        register(StopCommand())
        register(NowPlayingCommand())
        register(PauseCommand())
        register(VolumeCommand())
        register(QueueCommand())

        /* ---- [Discord] ---- */
        register(UserCommand())
        register(DashboardCommand())
        register(DblCommand())
        register(ServerCommand())

        /* ---- [Utils] ---- */
        register(HelpCommand())
        register(FoxyCommand())
        register(LanguageCommand())
    }
}