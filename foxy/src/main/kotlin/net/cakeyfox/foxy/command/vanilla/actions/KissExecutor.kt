package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class KissExecutor: FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        context.defer()
        val user = context.getOption<User>("user")!!
        val response = context.instance.utils.getActionImage("kiss")

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
                context.instance.interactionManager.createButtonForUser(
                    user,
                    ButtonStyle.PRIMARY,
                    FoxyEmotes.FoxyHug,
                    context.locale["kiss.button"],
                ) { it ->
                    val secondResponse = context.instance.utils.getActionImage("kiss")
                    it.reply {
                        embed {
                            description = context.locale["kiss.description", user.asMention, context.event.user.asMention]
                            image = secondResponse
                            color = Colors.FOXY_DEFAULT
                        }

                        actionRow(
                            context.instance.interactionManager.createButtonForUser(
                                context.event.user,
                                ButtonStyle.PRIMARY,
                                FoxyEmotes.FoxyHug,
                                context.locale["kiss.button"],
                            ) {
                                val thirdResponse = context.instance.utils.getActionImage("kiss")
                                it.reply {
                                    embed {
                                        description = context.locale["kiss.description", context.event.user.asMention, user.asMention]
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