package net.cakeyfox.foxy.command.structure

import dev.minn.jda.ktx.interactions.commands.Command
import dev.minn.jda.ktx.interactions.commands.Subcommand
import dev.minn.jda.ktx.interactions.commands.SubcommandGroup
import net.cakeyfox.foxy.utils.locales.FoxyLocale
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.interactions.DiscordLocale
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.commands.DefaultMemberPermissions
import net.dv8tion.jda.api.interactions.commands.build.OptionData
import net.dv8tion.jda.api.interactions.commands.build.SlashCommandData

class FoxyCommandDeclarationBuilder(
    val name: String,
    val description: String,
    val isPrivate: Boolean,
    var category: String,
    val availableForEarlyAccess: Boolean = false,
    val integrationType: List<IntegrationType> = listOf(IntegrationType.GUILD_INSTALL),
    val interactionContexts: List<InteractionContextType> = listOf(InteractionContextType.GUILD),
    var executor: FoxyCommandExecutor? = null
) {
    private val subCommands = mutableListOf<FoxyCommandDeclarationBuilder>()
    private val subCommandGroups = mutableListOf<FoxyCommandGroupBuilder>()
    private val permissions = mutableListOf<Permission>()
    private val commandOptions = mutableListOf<OptionData>()
    private val enUsLocale = FoxyLocale("en-us")
    private val ptBrLocale = FoxyLocale("pt-br")
    var baseName = ""

    fun subCommand(
        name: String,
        description: String,
        isPrivate: Boolean = false,
        category: String = this.category,
        integrationType: List<IntegrationType> = listOf(IntegrationType.GUILD_INSTALL),
        interactionContexts: List<InteractionContextType> = listOf(InteractionContextType.GUILD),
        baseName: String? = null,
        block: FoxyCommandDeclarationBuilder.() -> Unit
    ) {
        val subCommand = FoxyCommandDeclarationBuilder(
            name,
            description,
            isPrivate,
            category,
            availableForEarlyAccess,
            integrationType,
            interactionContexts
        )
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
        block: FoxyCommandGroupBuilder.() -> Unit
    ) {
        val group = FoxyCommandGroupBuilder(name, description)
        group.block()
        this.baseName = baseName
        subCommandGroups.add(group)
    }

    fun addPermission(vararg permission: Permission) {
        permission.forEach { permissions.add(it) }
    }

    fun addOptions(vararg options: List<OptionData>, isSubCommand: Boolean = false, baseName: String) {
        options.forEach { option ->
            addOption(*option.toTypedArray(), isSubCommand = isSubCommand, baseName = baseName)
        }
    }

    fun addOption(vararg option: OptionData, isSubCommand: Boolean = false, baseName: String) {
        option.forEach { op ->
            if (isSubCommand) {
                op.setNameLocalizations(
                    mapOf(
                        DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.${baseName}.${name}.options.${op.name}.name"],
                        DiscordLocale.ENGLISH_US to enUsLocale["commands.command.${baseName}.${name}.options.${op.name}.name"]
                    )
                )
                op.setDescriptionLocalizations(
                    mapOf(
                        DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.${baseName}.${name}.options.${op.name}.description"],
                        DiscordLocale.ENGLISH_US to enUsLocale["commands.command.${baseName}.${name}.options.${op.name}.description"]
                    )
                )
            } else {
                op.setNameLocalizations(
                    mapOf(
                        DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.$baseName.options.${op.name}.name"],
                        DiscordLocale.ENGLISH_US to enUsLocale["commands.command.$baseName.options.${op.name}.name"]
                    )
                )
                op.setDescriptionLocalizations(
                    mapOf(
                        DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.$baseName.options.${op.name}.description"],
                        DiscordLocale.ENGLISH_US to enUsLocale["commands.command.$baseName.options.${op.name}.description"]
                    )
                )
            }
            commandOptions.add(op)
        }
    }

    fun getSubCommand(name: String): FoxyCommandDeclarationBuilder? {
        return subCommands.find { it.name == name }
    }

    fun getSubCommandGroup(name: String): FoxyCommandGroupBuilder? {
        return subCommandGroups.find { it.name == name }
    }

    fun build(): SlashCommandData {
        val commandData = Command(name, description) {
            setNameLocalizations(
                mapOf(
                    DiscordLocale.ENGLISH_US to enUsLocale["commands.command.$name.name"],
                    DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.$name.name"]
                )
            )

            this.setIntegrationTypes(integrationType[0], *integrationType.drop(1).toTypedArray())
            this.setContexts(interactionContexts[0], *interactionContexts.drop(1).toTypedArray())
            val enUsCategory = enUsLocale["categories.$category"]
            val ptBrCategory = ptBrLocale["categories.$category"]

            setDescriptionLocalizations(
                mapOf(
                    DiscordLocale.PORTUGUESE_BRAZILIAN to buildDescription(
                        ptBrCategory,
                        ptBrLocale["commands.command.$name.description"]
                    ),
                    DiscordLocale.ENGLISH_US to buildDescription(
                        enUsCategory,
                        enUsLocale["commands.command.$name.description"]
                    )
                )
            )

            defaultPermissions = DefaultMemberPermissions.enabledFor(permissions)

            this.addOptions(commandOptions)
            subCommands.forEach { subCmd ->
                addSubcommands(
                    Subcommand(subCmd.name, subCmd.description) {
                        setNameLocalizations(
                            mapOf(
                                DiscordLocale.ENGLISH_US to enUsLocale["commands.command.${baseName}.${subCmd.name}.name"],
                                DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.${baseName}.${subCmd.name}.name"]
                            )
                        )

                        setDescriptionLocalizations(
                            mapOf(
                                DiscordLocale.ENGLISH_US to buildDescription(
                                    enUsCategory,
                                    enUsLocale["commands.command.${baseName}.${subCmd.name}.description"]
                                ),
                                DiscordLocale.PORTUGUESE_BRAZILIAN to buildDescription(
                                    ptBrCategory,
                                    ptBrLocale["commands.command.${baseName}.${subCmd.name}.description"]
                                )
                            )
                        )

                        this.addOptions(subCmd.commandOptions)
                    }
                )
            }

            subCommandGroups.forEach {
                addSubcommandGroups(
                    SubcommandGroup(it.name, it.description).apply {
                        it.subCommands.forEach { subCommand ->
                            addSubcommands(
                                Subcommand(subCommand.name, subCommand.description) {
                                    setNameLocalizations(
                                        mapOf(
                                            DiscordLocale.ENGLISH_US to enUsLocale["commands.command.${baseName}.${it.name}.${subCommand.name}.name"],
                                            DiscordLocale.PORTUGUESE_BRAZILIAN to ptBrLocale["commands.command.${baseName}.${it.name}.${subCommand.name}.name"]
                                        )
                                    )

                                    setDescriptionLocalizations(
                                        mapOf(
                                            DiscordLocale.ENGLISH_US to buildDescription(
                                                enUsCategory,
                                                enUsLocale["commands.command.${baseName}.${it.name}.${subCommand.name}.description"]
                                            ),
                                            DiscordLocale.PORTUGUESE_BRAZILIAN to buildDescription(
                                                ptBrCategory,
                                                ptBrLocale["commands.command.${baseName}.${it.name}.${subCommand.name}.description"]
                                            )
                                        )
                                    )
                                    this.addOptions(subCommand.commandOptions)
                                }
                            )
                        }
                    }
                )
            }

        }

        return commandData
    }

    private fun buildDescription(category: String, description: String): String {
        return "[$category] - $description"
    }
}