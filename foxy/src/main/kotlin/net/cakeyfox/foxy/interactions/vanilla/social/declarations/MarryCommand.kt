package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.social.marry.MarryAskExecutor
import net.cakeyfox.foxy.interactions.vanilla.social.marry.MarryLetterExecutor
import net.cakeyfox.foxy.interactions.vanilla.social.marry.MarryManagerExecutor
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.Command
import net.dv8tion.jda.api.interactions.commands.OptionType

class MarryCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("marry", CommandCategory.SOCIAL) {
        interactionContexts = listOf(InteractionContextType.GUILD, InteractionContextType.PRIVATE_CHANNEL)
        integrationType = listOf(IntegrationType.GUILD_INSTALL, IntegrationType.USER_INSTALL)

        subCommand("ask") {
            addOption(opt(OptionType.USER, "user", true))
            addOption(opt(OptionType.STRING, "proposal", false))
            enableLegacyMessageSupport = true
            aliases = listOf("marry", "casar")
            executor = MarryAskExecutor()
        }

        subCommand("manage") {
            enableLegacyMessageSupport = true
            aliases = listOf("casamentogerenciar", "marrymanager")
            executor = MarryManagerExecutor()
        }

        subCommand("letter") {
            addOption(
                opt(
                    OptionType.STRING,
                    "letter_type",
                    true,
                ).addChoices(
                    Command.Choice("Carta Padrão", "card.default"),
                    Command.Choice("Carta Comum [4.000 Cakes]", "card.common"),
                    Command.Choice("Carta Incomum [4.500 Cakes]", "card.uncommon"),
                    Command.Choice("Carta Rara [5.000 Cakes]", "card.rare"),
                    Command.Choice("Carta Épica [5.500 Cakes]", "card.epic")
                )
            )

            addOption(
                opt(OptionType.STRING, "letter", true)
                    .setMinLength(5)
                    .setMaxLength(500)
            )
            executor = MarryLetterExecutor()
        }
    }
}