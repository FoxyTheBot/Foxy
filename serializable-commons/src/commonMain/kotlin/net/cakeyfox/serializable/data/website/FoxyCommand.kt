package net.cakeyfox.serializable.data.website

data class FoxyCommand(
    val commandName: String,
    val commandDescription: String,
    val category: String? = null,
    val defaultMemberPermissions: List<String> = listOf(),
    val supportsLegacy: Boolean = false,
    val options: List<Option> = emptyList(),
    val aliases: List<String> = emptyList(),
    val supportsDmExecution: Boolean = false,
    val subCommands: List<FoxyCommand>? = emptyList()
)

data class Option(
    val name: String,
    val description: String,
    val required: Boolean = false,
    val type: String? = null,
)