package net.cakeyfox.foxy.interactions.vanilla.moderation.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.moderation.UnbanExecutor
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions
import net.dv8tion.jda.api.interactions.commands.OptionType

class UnbanCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("unban", CommandCategory.MODERATION) {
        this.defaultMemberPermissions = DefaultMemberPermissions.enabledFor(Permission.BAN_MEMBERS)

        addOptions(
            listOf(
                opt(
                    OptionType.USER,
                    "user",
                    true
                ),

                opt(
                    OptionType.STRING,
                    "reason"
                )
            )
        )

        executor = UnbanExecutor()
    }
}