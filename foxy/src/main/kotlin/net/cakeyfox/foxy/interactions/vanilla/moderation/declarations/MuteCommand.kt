package net.cakeyfox.foxy.interactions.vanilla.moderation.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions
import net.dv8tion.jda.api.interactions.commands.OptionType

class MuteCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("mute", CommandCategory.MODERATION) {
        this.defaultMemberPermissions = DefaultMemberPermissions.enabledFor(Permission.MODERATE_MEMBERS)

        addOptions(
            listOf(
                opt(OptionType.STRING, "users", true),
                opt(OptionType.INTEGER, "duration"),
                opt(OptionType.BOOLEAN, "skip_confirmation")
            )
        )
    }
}