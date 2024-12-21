package net.cakeyfox.foxy.command.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxySlashCommandExecutor
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class HugExecutor : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val user = context.getOption<User>("user")!!
        val response = context.utils.getActionImage("hug")

        context.reply {
            embed {
                description = context.locale["hug.description", context.event.user.asMention, user.asMention]
                color = Colors.FOXY_DEFAULT
                image = response
            }

            actionRow(
                context.instance.interactionManager.createButtonForUser(
                    user,
                    ButtonStyle.PRIMARY,
                    context.jda.getEmojiById(FoxyEmotes.FOXY_HUG),
                    context.locale["hug.button"]
                ) { it ->
                    val secondResponse = context.utils.getActionImage("hug")

                    it.reply {
                        embed {
                            description = context.locale["hug.description", user.asMention, context.event.user.asMention]
                            color = Colors.FOXY_DEFAULT
                            image = secondResponse
                        }

                        actionRow(
                            context.instance.interactionManager.createButtonForUser(
                                context.event.user,
                                ButtonStyle.PRIMARY,
                                context.jda.getEmojiById(FoxyEmotes.FOXY_HUG),
                                context.locale["hug.button"]
                            ) {
                                val thirdResponse = context.utils.getActionImage("hug")

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