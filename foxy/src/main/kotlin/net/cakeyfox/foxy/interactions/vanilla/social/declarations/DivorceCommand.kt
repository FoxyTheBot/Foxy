package net.cakeyfox.foxy.interactions.vanilla.social.declarations

import dev.minn.jda.ktx.coroutines.await
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.CommandCategory
import net.cakeyfox.foxy.interactions.commands.FoxyCommandDeclarationWrapper
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.interactions.IntegrationType
import net.dv8tion.jda.api.interactions.InteractionContextType
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class DivorceCommand : FoxyCommandDeclarationWrapper {
    override fun create() = slashCommand("divorce", CommandCategory.SOCIAL) {
        interactionContexts = listOf(
            InteractionContextType.GUILD,
            InteractionContextType.BOT_DM,
            InteractionContextType.PRIVATE_CHANNEL
        )
        integrationType = listOf(IntegrationType.USER_INSTALL, IntegrationType.GUILD_INSTALL)
        executor = DivorceExecutor()
    }

    inner class DivorceExecutor : FoxySlashCommandExecutor() {
        override suspend fun execute(context: FoxyInteractionContext) {
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