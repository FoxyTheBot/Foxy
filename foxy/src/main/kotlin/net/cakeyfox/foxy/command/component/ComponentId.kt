package net.cakeyfox.foxy.command.component

import java.util.UUID

class ComponentId(val uniqueId: UUID) {
    companion object {
        const val prefix = "foxy"

        operator fun invoke(componentIdWithPrefix: String): ComponentId {
            require(componentIdWithPrefix.startsWith("$prefix:")) { "It's not mine." }
            return ComponentId(UUID.fromString(componentIdWithPrefix.substringAfter(":")))
        }
    }

    override fun toString() = "$prefix:$uniqueId"
}