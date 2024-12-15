package net.cakeyfox.foxy.command.structure

import dev.minn.jda.ktx.interactions.commands.Command
import dev.minn.jda.ktx.interactions.commands.Subcommand
import dev.minn.jda.ktx.interactions.commands.SubcommandGroup
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.DiscordLocale
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions
import net.dv8tion.jda.api.interactions.commands.build.OptionData
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData

class FoxySlashCommandDeclarationBuilder(
    val name: String,
    val description: String,
    val isPrivate: Boolean,
    var executor: FoxySlashCommandExecutor? = null
) {
    val subCommands = mutableListOf<FoxySlashCommandDeclarationBuilder>()
    val subCommandGroups = mutableListOf<FoxySlashCommandGroupBuilder>()
    val permissions = mutableListOf<Permission>()
    val options = mutableListOf<OptionData>()
    var baseName = ""
    private val enUsLocale = FoxyLocale("en-us")
    private val ptBrLocale = FoxyLocale("pt-br")

    fun subCommand(
        name: String,
        description: String,
        isPrivate: Boolean = false,
        baseName: String? = null,
        block: FoxySlashCommandDeclarationBuilder.() -> Unit
    ) {
        val subCommand = FoxySlashCommandDeclarationBuilder(name, description, isPrivate)
        subCommand.baseName = baseName ?: this.name
        subCommand.block()
        subCommands.add(subCommand)

        if (baseName != null) {
            this.baseName = baseName
        }
    }

    fun subCommandGroup(
        name: String,
        description: String,
        baseName: String,
        block: FoxySlashCommandGroupBuilder.() -> Unit
    ) {
        val group = FoxySlashCommandGroupBuilder(name, description)
        group.block()
        this.baseName = baseName
        subCommandGroups.add(group)
    }

    fun addPermission(vararg permission: Permission) {
        permission.forEach { permissions.add(it) }
    }

    fun addOption(vararg option: OptionData, isSubCommand: Boolean = false, baseName: String) {
        option.forEach { op ->
            if (isSubCommand) {
                op.setDescriptionLocalizations(
                    mapOf(
                        DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.${baseName}.${name}.options.${op.name}.description"],
                        DiscordLocale.ENGLISH_US to enUsLocale["commands.command.${baseName}.${name}.options.${op.name}.description"]
                    )
                )
            } else {
                op.setDescriptionLocalizations(
                    mapOf(
                        DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.$baseName.options.${op.name}.description"],
                        DiscordLocale.ENGLISH_US to enUsLocale["commands.command.$baseName.options.${op.name}.description"]
                    )
                )
            }
            options.add(op)
        }
    }
        fun getSubCommand(name: String): FoxySlashCommandDeclarationBuilder? {
            return subCommands.find { it.name == name }
        }

        fun getSubCommandGroup(name: String): FoxySlashCommandGroupBuilder? {
            return subCommandGroups.find { it.name == name }
        }

        fun build(): SlashCommandData {
            val commandData = Command(name, description) {
                setDescriptionLocalizations(mapOf(
                    DiscordLocale.ENGLISH_US to enUsLocale["commands.command.$name.description"],
                    DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.$name.description"]
                ))

                defaultPermissions = DefaultMemberPermissions.enabledFor(permissions)

                this.addOptions(options)
                subCommands.forEach { subCmd ->
                    addSubcommands(
                        Subcommand(subCmd.name, subCmd.description) {
                            setDescriptionLocalizations(mapOf(
                                DiscordLocale.ENGLISH_US to enUsLocale["commands.command.${baseName}.${subCmd.name}.description"],
                                DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.${baseName}.${subCmd.name}.description"]
                            ))
                            this.addOptions(subCmd.options)
                        }
                    )
                }

                subCommandGroups.forEach {
                    addSubcommandGroups(
                        SubcommandGroup(it.name, it.description).apply {
                            it.subCommands.forEach { subCommand ->
                                addSubcommands(
                                    Subcommand(subCommand.name, subCommand.description) {
                                        setDescriptionLocalizations(mapOf(
                                            DiscordLocale.ENGLISH_US to enUsLocale["commands.command.${baseName}.${it.name}.${subCommand.name}.description"],
                                            DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.${baseName}.${it.name}.${subCommand.name}.description"]
                                        ))
                                        this.addOptions(subCommand.options)
                                    }
                                )
                            }
                        }
                    )
                }

            }

            return commandData
        }
    }