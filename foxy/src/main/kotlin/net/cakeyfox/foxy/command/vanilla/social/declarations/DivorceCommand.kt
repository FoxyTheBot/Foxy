package net.cakeyfox.foxy.command.vanilla.social.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.social.DivorceExecutor

class DivorceCommand : FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "divorce",
        "divorce.description"
    ) {
        executor = DivorceExecutor()
    }
}