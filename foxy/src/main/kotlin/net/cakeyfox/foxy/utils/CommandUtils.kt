package net.cakeyfox.foxy.utils

import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationBuilder
import net.cakeyfox.foxy.interactions.pretty

suspend fun isEarlyAccessOnlyCommand(
    context: CommandContext,
    command: FoxyCommandDeclarationBuilder
) {
    val isEarlyAccessEligible = PremiumUtils.eligibleForEarlyAccess(context)

    if (command.availableForEarlyAccess) {
        if (!isEarlyAccessEligible) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["commands.earlyAccess"]
                )
            }
            return
        } else command.executor?.execute(context)
    } else command.executor?.execute(context)
}