package net.cakeyfox.foxy.command

import dev.minn.jda.ktx.coroutines.await
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.economy.declarations.CakesCommand
import net.cakeyfox.foxy.command.vanilla.entertainment.declarations.FunCommand
import net.cakeyfox.foxy.command.vanilla.utils.declarations.FoxyCommand
import net.dv8tion.jda.api.interactions.commands.Command

class FoxyCommandManager(val instance: FoxyInstance) {
    val commands = mutableListOf<FoxySlashCommandDeclarationWrapper>()

    operator fun get(name: String): FoxySlashCommandDeclarationWrapper? {
        return commands.find { it.create().name == name }
    }

    private fun register(command: FoxySlashCommandDeclarationWrapper) {
        commands.add(command)
    }

    suspend fun handle(): MutableList<Command>? {
        val action = instance.jda.updateCommands()
        val privateGuild = instance.jda.getGuildById(instance.config.get("guild_id"))!!

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
        register(FoxyCommand())
        register(FunCommand())
        register(CakesCommand())
    }
}