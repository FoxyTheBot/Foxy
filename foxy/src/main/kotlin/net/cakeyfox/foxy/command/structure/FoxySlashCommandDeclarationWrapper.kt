package net.cakeyfox.foxy.command.structure

interface FoxySlashCommandDeclarationWrapper {
    fun create(): FoxySlashCommandDeclarationBuilder

    fun command(name: String, description: String, isPrivate: Boolean = false, block: FoxySlashCommandDeclarationBuilder.() -> Unit): FoxySlashCommandDeclarationBuilder {
        return FoxySlashCommandDeclarationBuilder(name, description, isPrivate).apply(block)
    }
}