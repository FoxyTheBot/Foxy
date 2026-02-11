package net.cakeyfox.foxy.interactions.vanilla.moderation.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.moderation.ClearExecutor
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions
import net.dv8tion.jda.api.interactions.commands.OptionType

class ClearCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("clear", CommandCategory.MODERATION) {
        this.defaultMemberPermissions = DefaultMemberPermissions.enabledFor(Permission.MESSAGE_MANAGE)

        subCommand("chat") {
            addOptions(
                listOf(
                    opt(OptionType.INTEGER, "quantity", true),
                    opt(OptionType.STRING, "users"),
                ),
                isSubCommand = true,
            )

            executor = ClearExecutor()
        }
    }
}