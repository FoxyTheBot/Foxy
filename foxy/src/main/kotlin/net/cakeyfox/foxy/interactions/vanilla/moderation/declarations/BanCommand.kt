package net.cakeyfox.foxy.interactions.vanilla.moderation.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.moderation.BanExecutor
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions
import net.dv8tion.jda.api.interactions.commands.OptionType

class BanCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("ban", CommandCategory.MODERATION) {
        this.defaultMemberPermissions = DefaultMemberPermissions.enabledFor(Permission.BAN_MEMBERS)

        addOptions(
            listOf(
                opt(OptionType.STRING, "users", true),
                opt(OptionType.INTEGER, "time")
                    .addChoice("1 day", 86_400_000)
                    .addChoice("3 days", 259_200_000)
                    .addChoice("7 days", 604_800_000)
                    .addChoice("15 days", 1_296_000_000)
                    .addChoice("30 days", 2_592_000_000)
                    .addChoice("45 days", 3_888_000_000)
                    .addChoice("60 days", 5_184_000_000)
                    .addChoice("90 days", 7_776_000_000)
                    .addChoice("180 days", 15_552_000_000)
                    .addChoice("1 year", 31_536_000_000)
                    .addChoice("2 years", 63_072_000_000)
                    .addChoice("5 years", 157_680_000_000)
                    .addChoice("Permanent", 0),
                opt(OptionType.STRING, "reason"),
                opt(OptionType.BOOLEAN, "skip_confirmation"),
//                opt(OptionType.INTEGER, "messages_to_delete")
            )
        )

        executor = BanExecutor()
    }
}