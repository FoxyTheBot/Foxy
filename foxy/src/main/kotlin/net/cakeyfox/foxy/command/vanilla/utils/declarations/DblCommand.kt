package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.DblExecutor

class DblCommand : FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "dbl",
        "dbl.description"
    ) {
        executor = DblExecutor()
    }
}