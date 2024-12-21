package net.cakeyfox.foxy.command.vanilla.entertainment.declarations

import net.cakeyfox.foxy.command.structure.FoxySlashCommandDeclarationWrapper
import net.cakeyfox.foxy.command.vanilla.entertainment.AntesQueVireModaExecutor
import net.cakeyfox.foxy.command.vanilla.entertainment.EminemExecutor
import net.dv8tion.jda.api.interactions.commands.OptionType
import net.dv8tion.jda.api.interactions.commands.build.OptionData

class FunCommand: FoxySlashCommandDeclarationWrapper {
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
    }
}