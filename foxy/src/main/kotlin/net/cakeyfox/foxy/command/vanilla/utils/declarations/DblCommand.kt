package net.cakeyfox.foxy.command.vanilla.utils.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.utils.DblExecutor

class DblCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "dbl",
        "dbl.description"
    ) {
        executor = DblExecutor()
    }
}