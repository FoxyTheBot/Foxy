package net.cakeyfox.foxy.interactions.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class KissExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val user = context.getOption<User>("user")!!
        val response = context.foxy.utils.getActionImage("kiss")

        if (user == context.jda.selfUser) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyRage,
                    context.locale["kiss.kissBot"]
                )
            }

            return
        }

        context.reply {
            embed {
                description = context.locale["kiss.description", context.event.user.asMention, user.asMention]
                image = response
                color = Colors.FOXY_DEFAULT
            }

            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    user,
                    ButtonStyle.PRIMARY,
                    FoxyEmotes.FoxyHug,
                    context.locale["kiss.button"],
                ) { it ->
                    val secondResponse = context.foxy.utils.getActionImage("kiss")
                    it.edit {
                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                user,
                                ButtonStyle.PRIMARY,
                                FoxyEmotes.FoxyHug,
                                context.locale["kiss.button"],
                            ) { }.asDisabled()
                        )
                    }

                    it.reply {
                        embed {
                            description =
                                context.locale["kiss.description", user.asMention, context.event.user.asMention]
                            image = secondResponse
                            color = Colors.FOXY_DEFAULT
                        }

                        actionRow(
                            context.foxy.interactionManager.createButtonForUser(
                                context.event.user,
                                ButtonStyle.PRIMARY,
                                FoxyEmotes.FoxyHug,
                                context.locale["kiss.button"],
                            ) {
                                val thirdResponse = context.foxy.utils.getActionImage("kiss")
                                it.edit {
                                    actionRow(
                                        context.foxy.interactionManager.createButtonForUser(
                                            user,
                                            ButtonStyle.PRIMARY,
                                            FoxyEmotes.FoxyHug,
                                            context.locale["kiss.button"],
                                        ) { }.asDisabled()
                                    )
                                }

                                it.reply {
                                    embed {
                                        description =
                                            context.locale["kiss.description", context.event.user.asMention, user.asMention]
                                        image = thirdResponse
                                        color = Colors.FOXY_DEFAULT
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