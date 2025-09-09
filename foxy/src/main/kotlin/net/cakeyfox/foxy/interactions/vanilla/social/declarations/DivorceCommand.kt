package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import dev.minn.jda.ktx.coroutines.await
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType

class DivorceCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("divorce", CommandCategory.SOCIAL) {
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)
        supportsLegacy = true
        aliases = listOf("divorciar")
        executor = DivorceExecutor()
    }

    inner class DivorceExecutor : UnleashedCommandExecutor() {
        override suspend fun execute(context: CommandContext) {
            if (context.getAuthorData().marryStatus.marriedWith == null) {
                context.reply {
                    content = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale["divorce.notMarried"]
                    )
                }
                return
            }

            val partner = context.database.user.getFoxyProfile(
                context.getAuthorData().marryStatus.marriedWith!!
            )
            val partnerAsUser = context.jda.retrieveUserById(partner._id).await()

            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry,
                    context.locale["divorce.confirm", partnerAsUser.globalName ?: partnerAsUser.name]
                )

                actionRow(
                    context.foxy.interactionManager.createButtonForUser(
                        context.user,
                        ButtonStyle.DANGER,
                        FoxyEmotes.FoxyCry,
                        context.locale["divorce.confirmButton"]
                    ) {
                        context.database.user.updateUsers(
                            listOf(
                                context.getAuthorData(),
                                partner
                            ),
                            mapOf(
                                "marryStatus.marriedWith" to null,
                                "marryStatus.marriedDate" to null
                            )
                        )

                        it.edit {
                            content = pretty(
                                FoxyEmotes.FoxyYay,
                                context.locale["divorce.success"]
                            )


                            actionRow(
                                context.foxy.interactionManager.createButtonForUser(
                                    context.user,
                                    ButtonStyle.SECONDARY,
                                    FoxyEmotes.FoxyCry,
                                    context.locale["divorce.confirmButton"]
                                ) { }.asDisabled()
                            )
                        }
                    }
                )
            }
        }
    }
}