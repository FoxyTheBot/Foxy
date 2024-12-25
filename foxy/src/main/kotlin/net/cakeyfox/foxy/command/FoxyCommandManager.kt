package net.cakeyfox.foxy.command

import dev.minn.jda.ktx.coroutines.await
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
import net.cakeyfox.foxy.command.vanilla.utils.declarations.TopCommand
import net.dv8tion.jda.api.interactions.commands.Command

class FoxyCommandManager(private val foxy: FoxyInstance) {
    private val commands = mutableListOf<FoxyCommandDeclarationWrapper>()

    operator fun get(name: String): FoxyCommandDeclarationWrapper? {
        return commands.find { it.create().name == name }
    }

    private fun register(command: FoxyCommandDeclarationWrapper) {
        commands.add(command)
    }

    suspend fun handle(): MutableList<Command>? {
        val action = foxy.jda.updateCommands()
        val privateGuild = foxy.jda.getGuildById(foxy.config.guildId)!!

        commands.forEach { command ->
            if (command.create().isPrivate) {
                privateGuild.updateCommands().addCommands(
                    command.create().build()
                ).await()
            } else {
                action.addCommands(
                    command.create().build()
                )
            }
        }

        return action.await()
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
    }
}