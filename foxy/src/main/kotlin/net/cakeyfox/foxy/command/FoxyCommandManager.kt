package net.cakeyfox.foxy.command

import dev.minn.jda.ktx.coroutines.await
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.actions.declarations.ActionsCommand
import net.cakeyfox.foxy.command.vanilla.economy.declarations.CakesCommand
import net.cakeyfox.foxy.command.vanilla.economy.declarations.DailyCommand
import net.cakeyfox.foxy.command.vanilla.entertainment.declarations.*
import net.cakeyfox.foxy.command.vanilla.social.declarations.AboutMeCommand
import net.cakeyfox.foxy.command.vanilla.social.declarations.DivorceCommand
import net.cakeyfox.foxy.command.vanilla.social.declarations.MarryCommand
import net.cakeyfox.foxy.command.vanilla.social.declarations.ProfileCommand
import net.cakeyfox.foxy.command.vanilla.utils.declarations.DblCommand
import net.cakeyfox.foxy.command.vanilla.utils.declarations.HelpCommand
import net.cakeyfox.foxy.command.vanilla.utils.declarations.PingCommand
import net.cakeyfox.foxy.command.vanilla.utils.declarations.TopCommand
import net.dv8tion.jda.api.interactions.commands.Command
import kotlin.reflect.jvm.jvmName

class FoxyCommandManager(private val foxy: FoxyInstance) {
    private val commands = mutableListOf<FoxyCommandDeclarationWrapper>()
    private val logger = KotlinLogging.logger(this::class.jvmName)

    operator fun get(name: String): FoxyCommandDeclarationWrapper? {
        return commands.find { it.create().name == name }
    }

    private fun register(command: FoxyCommandDeclarationWrapper) {
        commands.add(command)
    }

    suspend fun handle(): MutableList<Command> {
        val allCommands = mutableListOf<Command>()
        logger.info { "Starting command handling for ${foxy.shardManager.shards.size + 1} shards" }
        foxy.shardManager.shards.forEach { shard ->
            val action = shard.updateCommands()

            commands.forEach { command ->
                action.addCommands(command.create().build())
            }

            val registeredCommands = action.await()
            allCommands.addAll(registeredCommands)
            logger.info { "${commands.size} commands registered on shard ${shard.shardInfo.shardId}" }
        }

        return allCommands
    }


    init {
        /* ---- [Roleplay] ---- */
        register(ActionsCommand())

        /* ---- [Economy] ---- */
        register(CakesCommand())
        register(DailyCommand())
        register(TopCommand())

        /* ---- [Entertainment] ---- */
        register(FunCommand())
        register(AskFoxyCommand())
        register(FateCommand())
        register(CancelCommand())
        register(RateWaifuCommand())

        /* ---- [Social] ---- */
        register(AboutMeCommand())
        register(ProfileCommand())
        register(MarryCommand())
        register(DivorceCommand())

        /* ---- [Utils] ---- */
        register(HelpCommand())
        register(DblCommand())
        register(PingCommand())
    }
}