package net.cakeyfox.foxy.interactions.vanilla.entertainment.declarations

import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.vanilla.entertainment.media.*
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class MagicCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("magic", CommandCategory.MAGIC) {
        integrationType = listOf(
            IntegrationType.GUILD_INSTALL,
            IntegrationType.USER_INSTALL
        )
        interactionContexts = listOf(
            InteractionContextType.BOT_DM,
            InteractionContextType.GUILD,
            InteractionContextType.PRIVATE_CHANNEL
        )

        subCommandGroup("eminem") {
            subCommand("8mile") {
                executor = EminemExecutor()
                addOption(
                    opt(OptionType.ATTACHMENT, "video_or_audio", true),
                    isSubCommand = true
                )
            }
        }

        subCommand("antes_que_vire_moda") {
            addOption(
                opt(OptionType.ATTACHMENT, "image", true),
                isSubCommand = true
            )
            executor = AntesQueVireModaExecutor()
        }

        subCommand("windows_error") {
            addOption(
                opt(OptionType.STRING, "message", true),
                isSubCommand = true
            )
            executor = ErrorExecutor()
        }

        subCommand("girlfriend") {
            addOption(
                opt(OptionType.USER, "user", true),
                isSubCommand = true
            )
            executor = GirlfriendMemeExecutor()
        }

        subCommand("nao_somos_iguais") {
            addOptions(
                listOf(
                    opt(OptionType.ATTACHMENT, "first_image", true),
                    opt(OptionType.ATTACHMENT, "second_image", true),
                    opt(OptionType.STRING, "text")
                ),
                isSubCommand = true
            )
            executor = GostosIguaisExecutor()
        }

        subCommand("laranjo") {
            addOption(
                opt(OptionType.STRING, "text", true),
                isSubCommand = true
            )
            executor = LaranjoExecutor()
        }

        subCommand("stonks") {
            addOption(
                opt(OptionType.STRING, "text", true),
                isSubCommand = true
            )
            executor = StonksExecutor()
        }

        subCommand("not_stonks") {
            addOption(
                opt(OptionType.STRING, "text", true),
                isSubCommand = true
            )

            executor = NotStonksExecutor()
        }
    }
}