package net.cakeyfox.foxy.command.structure

class FoxyCommandGroupBuilder(
    val name: String,
    val description: String
) {
    val subCommands = mutableListOf<FoxyCommandDeclarationBuilder>()

    fun subCommand(name: String, description: String, isPrivate: Boolean = false, block: FoxyCommandDeclarationBuilder.() -> Unit) {
        val subCommand = FoxyCommandDeclarationBuilder(name, description, isPrivate)
        subCommand.block()
        subCommands.add(subCommand)
    }

    fun getSubCommand(name: String): FoxyCommandDeclarationBuilder? {
        return subCommands.find { it.name == name }
    }
}