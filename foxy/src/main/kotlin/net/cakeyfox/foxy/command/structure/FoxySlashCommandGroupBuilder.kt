package net.cakeyfox.foxy.command.structure

class FoxySlashCommandGroupBuilder(
    val name: String,
    val description: String
) {
    val subCommands = mutableListOf<FoxySlashCommandDeclarationBuilder>()

    fun subCommand(name: String, description: String, isPrivate: Boolean = false, block: FoxySlashCommandDeclarationBuilder.() -> Unit) {
        val subCommand = FoxySlashCommandDeclarationBuilder(name, description, isPrivate)
        subCommand.block()
        subCommands.add(subCommand)
    }

    fun getSubCommand(name: String): FoxySlashCommandDeclarationBuilder? {
        return subCommands.find { it.name == name }
    }
}