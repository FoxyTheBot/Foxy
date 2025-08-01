package net.cakeyfox.foxy.interactions.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.FoxyInteractionContext
import net.cakeyfox.foxy.interactions.commands.FoxySlashCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.linkButton
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class RoleplayActionExecutor(
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
                        val giver = user
                        val receiver = context.user

                        sendActionEmbed(context, interaction, response) {
                            this.giver = giver
                            this.receiver = receiver
                            this.action = action
                        }
                    },

                    linkButton(FoxyEmotes.FoxyHm, context.locale["imageSource"], response)
                )
            }
        }
    }

    private suspend fun sendActionEmbed(
        context: FoxyInteractionContext,
        interaction: FoxyInteractionContext,
        oldResponse: String,
        data: RoleplayDataBuilder.() -> Unit = {}
    ) {
        val roleplayData = buildRoleplayData(data)
        val response = context.utils.getActionImage(roleplayData.action)

        interaction.edit {
            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    roleplayData.receiver,
                    ButtonStyle.PRIMARY,
                    actionEmoji,
                    context.locale["${roleplayData.action}.button"]
                ) { }.withDisabled(true),

                linkButton(FoxyEmotes.FoxyHm, context.locale["imageSource"], oldResponse)
            )
        }

        interaction.reply {
            embed {
                description = context.locale[
                    "${roleplayData.action}.description",
                    roleplayData.giver.asMention,
                    roleplayData.receiver.asMention
                ]
                color = Colors.RANDOM
                image = response
            }

            if (canRetribute == true) {
                actionRow(
                    context.foxy.interactionManager.createButtonForUser(
                        roleplayData.receiver,
                        ButtonStyle.PRIMARY,
                        actionEmoji,
                        context.locale["${roleplayData.action}.button"]
                    ) { nextInteraction ->
                        sendActionEmbed(context, nextInteraction, response) {
                            giver = roleplayData.receiver
                            receiver = roleplayData.giver
                            action = roleplayData.action
                        }
                    },

                    linkButton(FoxyEmotes.FoxyHm, context.locale["imageSource"], response)
                )
            }
        }
    }

    inner class RoleplayDataBuilder {
        var giver: User? = null
        var receiver: User? = null
        var action: String = ""

        fun build(): RoleplayData {
            val g = giver ?: throw IllegalArgumentException("giver is required")
            val r = receiver ?: throw IllegalArgumentException("receiver is required")
            return RoleplayData(g, r, action)
        }
    }

    fun buildRoleplayData(block: RoleplayDataBuilder.() -> Unit): RoleplayData {
        val builder = RoleplayDataBuilder()
        builder.block()
        return builder.build()
    }
}