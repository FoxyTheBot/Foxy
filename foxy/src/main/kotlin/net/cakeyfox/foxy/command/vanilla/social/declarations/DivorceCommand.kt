package net.cakeyfox.foxy.command.vanilla.social.declarations

import net.cakeyfox.foxy.command.structure.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.social.DivorceExecutor

class DivorceCommand : FoxyCommandDeclarationWrapper {
    override fun create() = command(
        "divorce",
        "divorce.description"
    ) {
        executor = DivorceExecutor()
    }
}