package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.InfoExecutor
import net.cakeyfox.foxy.command.vanilla.utils.PingExecutor

class FoxyCommand : FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "foxy",
        "foxy.description"
    ) {
        subCommand(
            "ping",
            "foxy.ping.description",
            baseName = this@command.name
        ) {
            executor = PingExecutor()
        }

        subCommand(
            "info",
            "foxy.info.description",
            baseName = this@command.name
        ) {
            executor = InfoExecutor()
        }
    }
}