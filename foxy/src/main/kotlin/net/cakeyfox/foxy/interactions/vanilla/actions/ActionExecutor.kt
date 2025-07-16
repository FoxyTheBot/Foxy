package net.cakeyfox.foxy.interactions.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class ActionExecutor(
    val canDoWithBot: Boolean? = false,
    val canRetribute: Boolean? = true,
    val actionEmoji: String = FoxyEmotes.FoxyHm
) : FoxySlashCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val action = if (context.event is SlashCommandInteractionEvent) context.event.subcommandName else return

        context.defer()

        val user = context.getOption<User>("user")
        val response = context.foxy.utils.getActionImage(action!!)

        if (canDoWithBot == false && user == context.jda.selfUser) {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyScared,
                    context.locale[
                        "$action.botAsTargetMessage",
                        context.user.asMention,
                        context.jda.selfUser.asMention
                    ]
                )
            }

            return
        } else if (canDoWithBot == true && user == context.jda.selfUser) {
            context.reply {
                embed {
                    description = context.locale[
                        "$action.botAsTargetMessage",
                        context.user.asMention,
                        context.jda.selfUser.asMention
                    ]
                    color = Colors.RANDOM
                    image = response
                }
            }

            return
        }

        if (user == context.user) {
            context.reply {
                embed {
                    description = context.locale[
                        "$action.didActionWithYourself",
                        user.asMention
                    ]
                    color = Colors.RANDOM
                    image = response
                }
            }
            return
        }

        context.reply {
            embed {
                description = context.locale[
                    "$action.description",
                    context.event.user.asMention,
                    user?.asMention ?: " "
                ]
                color = Colors.RANDOM
                image = response
            }

            if (canRetribute == true) {
                actionRow(
                    context.foxy.interactionManager.createButtonForUser(
                        user!!,
                        ButtonStyle.PRIMARY,
                        actionEmoji,
                        context.locale["$action.button"]
                    ) { interaction ->
                        sendActionEmbed(context, user, context.user, interaction, action)
                    }
                )
            }
        }
    }

    private suspend fun sendActionEmbed(
        context: FoxyInteractionContext,
        sender: User,
        receiver: User,
        interaction: FoxyInteractionContext,
        action: String
    ) {
        val response = context.utils.getActionImage(action)

        interaction.reply {
            embed {
                description = context.locale["$action.description", sender.asMention, receiver.asMention]
                color = Colors.RANDOM
                image = response
            }

            if (canRetribute == true) {
                actionRow(
                    context.foxy.interactionManager.createButtonForUser(
                        receiver,
                        ButtonStyle.PRIMARY,
                        actionEmoji,
                        context.locale["$action.button"]
                    ) { nextInteraction ->
                        sendActionEmbed(context, receiver, sender, nextInteraction, action)
                    }
                )
            }
        }
    }
}