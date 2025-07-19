package net.cakeyfox.foxy.interactions.vanilla.actions

import net.dv8tion.jda.api.entities.User

data class RoleplayData(
    val giver: User,
    val receiver: User,
    val action: String = ""
)
