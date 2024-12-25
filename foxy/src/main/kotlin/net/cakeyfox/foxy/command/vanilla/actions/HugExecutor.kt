package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class HugExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()

        val user = context.getOption<User>("user")!!
        val response = context.utils.getActionImage("hug")

        if (user == context.jda.selfUser) {
            context.reply {
                embed {
                    description = context.locale["hug.hugBot", context.user.asMention, context.jda.selfUser.asMention]
                    color = Colors.RED
                    image = response
                }
            }

            return
        }

        if (user == context.user) {
            context.reply {
                embed {
                    description = context.locale["hug.selfHug", context.jda.selfUser.asMention, user.asMention]
                    color = Colors.RED
                    image = response
                }
            }
            return
        }

        context.reply {
            embed {
                description = context.locale["hug.description", context.event.user.asMention, user.asMention]
                color = Colors.FOXY_DEFAULT
                image = response
            }

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    user,
                    ButtonStyle.PRIMARY,
                    FoxyEmotes.FoxyHug,
                    context.locale["hug.button"]
                ) { it ->
                    val secondResponse = context.utils.getActionImage("hug")

                    it.edit {
                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                user,
                                ButtonStyle.PRIMARY,
                                FoxyEmotes.FoxyHug,
                                context.locale["hug.button"]
                            ) { }.asDisabled()
                        )
                    }

                    it.reply {
                        embed {
                            description = context.locale["hug.description", user.asMention, context.event.user.asMention]
                            color = Colors.FOXY_DEFAULT
                            image = secondResponse
                        }

                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                context.event.user,
                                ButtonStyle.PRIMARY,
                                FoxyEmotes.FoxyHug,
                                context.locale["hug.button"]
                            ) {
                                val thirdResponse = context.utils.getActionImage("hug")

                                it.edit {
                                    actionRow(
                                        context.foxy.interactionManager.createButtonForUser(
                                            user,
                                            ButtonStyle.PRIMARY,
                                            FoxyEmotes.FoxyHug,
                                            context.locale["hug.button"]
                                        ) { }.asDisabled()
                                    )
                                }

                                it.reply {
                                    embed {
                                        description = context.locale["hug.description", context.event.user.asMention, user.asMention]
                                        color = Colors.FOXY_DEFAULT
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