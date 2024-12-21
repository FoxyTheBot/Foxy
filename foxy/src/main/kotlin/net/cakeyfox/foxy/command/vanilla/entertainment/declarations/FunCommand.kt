package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.media.*
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class FunCommand : FoxySlashCommandDeclarationWrapper {
    override fun create() = command(
        "fun",
        "fun.description"
    ) {
        subCommandGroup(
            "eminem",
            "fun.eminem.description",
            baseName = this@command.name
        ) {
            subCommand(
                "8mile",
                "fun.eminem.8mile.description",
                block = {
                    executor = EminemExecutor()
                    addOption(
                        OptionData(
                            OptionType.ATTACHMENT,
                            "video_or_audio",
                            "fun.eminem.8mile.option.description",
                            true
                        ),
                        isSubCommand = true,
                        baseName = this@command.name
                    )
                }
            )
        }

        subCommand(
            "antes_que_vire_moda",
            "fun.moda.description",
            block = {
                executor = AntesQueVireModaExecutor()
                addOption(
                    OptionData(
                        OptionType.ATTACHMENT,
                        "image",
                        "fun.moda.option.description",
                        true
                    ),
                    isSubCommand = true,
                    baseName = this@command.name
                )
            }
        )

        subCommand(
            "windows_error",
            "fun.windows_error.description"
        ) {
            executor = ErrorExecutor()
            addOption(
                OptionData(
                    OptionType.STRING,
                    "message",
                    "fun.windows_error.option.description",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )
        }

        subCommand(
            "girlfriend",
            "fun.girlfriend.description"
        ) {
            executor = GirlfriendMemeExecutor()
            addOption(
                OptionData(
                    OptionType.USER,
                    "user",
                    "fun.girlfriend.option.description",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )
        }

        subCommand(
            "nao_somos_iguais",
            "fun.nao_somos_iguais.description"
        ) {
            executor = GostosIguaisExecutor()
            baseName = this@command.name

            addOptions(
                listOf(
                    OptionData(
                        OptionType.ATTACHMENT,
                        "first_image",
                        "fun.nao_somos_iguais.option.first_image",
                        true
                    ),

                    OptionData(
                        OptionType.ATTACHMENT,
                        "second_image",
                        "fun.nao_somos_iguais.option.second_image",
                        true
                    ),

                    OptionData(
                        OptionType.STRING,
                        "text",
                        "fun.nao_somos_iguais.option.text",
                        false
                    )
                ),
                isSubCommand = true,
                baseName = this@command.name,
            )
        }

        subCommand(
            "laranjo",
            "fun.laranjo.description"
        ) {
            executor = LaranjoExecutor()
            addOption(
                OptionData(
                    OptionType.STRING,
                    "text",
                    "fun.laranjo.option.description",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )
        }

        subCommand(
            "stonks",
            "fun.stonks.description"
        ) {
            executor = StonksExecutor()
            addOption(
                OptionData(
                    OptionType.STRING,
                    "text",
                    "fun.stonks.option.description",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )
        }

        subCommand(
            "not_stonks",
            "fun.not_stonks.description"
        ) {
            executor = NotStonksExecutor()
            addOption(
                OptionData(
                    OptionType.STRING,
                    "text",
                    "fun.not_stonks.option.description",
                    true
                ),
                isSubCommand = true,
                baseName = this@command.name
            )
        }
    }
}