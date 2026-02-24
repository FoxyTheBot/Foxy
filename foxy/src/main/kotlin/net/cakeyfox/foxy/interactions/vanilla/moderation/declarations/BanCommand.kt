package net.cakeyfox.foxy.interactions.vanilla.moderation.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.moderation.BanExecutor
import net.cakeyfox.foxy.interactions.vanilla.moderation.ViewBanExecutor
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions
import net.dv8tion.jda.api.interactions.commands.OptionType

class BanCommand : FoxyCommandDeclarationWrapper {
    companion object {
        val banTimeOptions = listOf(
            "1 day" to 86_400_000L,
            "3 days" to 259_200_000L,
            "7 days" to 604_800_000L,
            "15 days" to 1_296_000_000L,
            "30 days" to 2_592_000_000L,
            "45 days" to 3_888_000_000L,
            "60 days" to 5_184_000_000L,
            "90 days" to 7_776_000_000L,
            "180 days" to 15_552_000_000L,
            "1 year" to 31_536_000_000L,
            "Permanent" to 0L
        )
    }
    override fun create() = slashCommand("ban", CommandCategory.MODERATION) {
        this.defaultMemberPermissions = DefaultMemberPermissions.enabledFor(Permission.BAN_MEMBERS)

        subCommand("ban") {
            addOptions(
                listOf(
                    opt(OptionType.STRING, "users", true),
                    opt(OptionType.INTEGER, "time").apply {
                        banTimeOptions.forEach { (name, value) ->
                            addChoice(name, value)
                        }
                    },
                    opt(OptionType.STRING, "reason"),
                    opt(OptionType.BOOLEAN, "skip_confirmation"),
//                opt(OptionType.INTEGER, "messages_to_delete")
                ),

                isSubCommand = true
            )

            executor = BanExecutor()
        }

        subCommand("manage") {
            addOption(
                opt(
                    OptionType.USER,
                    "user",
                    true
                ),

                isSubCommand = true
            )

            executor = ViewBanExecutor()
        }
    }
}