package net.cakeyfox.foxy.command.structure

interface FoxyCommandDeclarationWrapper {
    fun create(): FoxyCommandDeclarationBuilder

    fun command(name: String, description: String, isPrivate: Boolean = false, block: FoxyCommandDeclarationBuilder.() -> Unit): FoxyCommandDeclarationBuilder {
        return FoxyCommandDeclarationBuilder(name, description, isPrivate).apply(block)
    }
}