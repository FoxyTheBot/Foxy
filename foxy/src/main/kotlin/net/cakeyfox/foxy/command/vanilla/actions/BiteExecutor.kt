package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.components.button.ButtonStyle
import net.dv8tion.jda.api.entities.User


class BiteExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val user = context.getOption<User>("user")!!
        val response = context.foxy.utils.getActionImage("bite")

        context.reply {
            embed {
                description = context.locale["bite.description", context.event.user.asMention, user.asMention]
                color = Colors.BLUE
                image = response
            }

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    user,
                    ButtonStyle.PRIMARY,
                    FoxyEmotes.FoxyHug,
                    context.locale["bite.button"]
                ) { it ->
                    val secondResponse = context.utils.getActionImage("bite")

                    it.edit {
                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                context.event.user,
                                ButtonStyle.PRIMARY,
                                FoxyEmotes.FoxyHug,
                                context.locale["bite.button"]
                            ) { }.asDisabled()
                        )
                    }

                    it.reply {
                        embed {
                            description = context.locale["bite.description", user.asMention, context.event.user.asMention]
                            color = Colors.BLUE
                            image = secondResponse
                        }

                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                context.event.user,
                                ButtonStyle.PRIMARY,
                                FoxyEmotes.FoxyHug,
                                context.locale["bite.button"]
                            ) {
                                val thirdResponse = context.utils.getActionImage("bite")

                                it.edit {
                                    actionRow(
                                        context.foxy.interactionManager.createButtonForUser(
                                            context.event.user,
                                            ButtonStyle.PRIMARY,
                                            FoxyEmotes.FoxyHug,
                                            context.locale["bite.button"]
                                        ) { }.asDisabled()
                                    )
                                }

                                it.reply {
                                    embed {
                                        description = context.locale["bite.description", context.event.user.asMention, user.asMention]
                                        color = Colors.BLUE
                                        image = thirdResponse
                                    }
                                }
                            }
                        )
                    }
                }
            )
        }
    }
}
