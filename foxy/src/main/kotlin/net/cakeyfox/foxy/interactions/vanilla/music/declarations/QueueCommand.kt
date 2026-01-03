package net.cakeyfox.foxy.interactions.vanilla.music.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.music.QueueExecutor

class QueueCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("queue", CommandCategory.MUSIC) {
        enableLegacyMessageSupport = true
        aliases = listOf("fila", "q", "queue")

        executor = QueueExecutor()
    }
}