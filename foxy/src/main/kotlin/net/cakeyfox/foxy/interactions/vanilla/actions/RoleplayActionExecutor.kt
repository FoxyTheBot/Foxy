package net.cakeyfox.foxy.interactions.vanilla.actions

import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.linkButton
import net.dv8tion.jda.api.components.actionrow.ActionRow
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent

class RoleplayActionExecutor(
    val canDoWithBot: Boolean? = false,
    val canRetribute: Boolean? = true,
    val actionEmoji: String = FoxyEmotes.FoxyHm
) : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val action =
            if (context.event is SlashCommandInteractionEvent) (context.event as SlashCommandInteractionEvent).subcommandName else return
        context.defer()

        val actionStreakKey = "$action:0"
        var streak = actionStreakKey.split(":").getOrNull(1)?.toIntOrNull() ?: 0

        val user = context.getOption("user", 0, User::class.java)
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
                    context.user.asMention,
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
                        streak++
                        val giver = user
                        val receiver = context.user

                        sendActionEmbed(context, interaction, response, streak) {
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
        context: CommandContext,
        interaction: CommandContext,
        oldResponse: String,
        streak: Int,
        data: RoleplayDataBuilder.() -> Unit = {}
    ) {
        val roleplayData = buildRoleplayData(data)
        val response = context.utils.getActionImage(roleplayData.action)
        var newStreak = streak
        interaction.edit {
            actionRow(
                context.foxy.interactionManager.createButtonForUser(
                    roleplayData.receiver,
                    ButtonStyle.PRIMARY,
                    actionEmoji,
                    context.locale["${roleplayData.action}.button"]
                ) {}.withDisabled(true),

                linkButton(FoxyEmotes.FoxyHm, context.locale["imageSource"], response)
            )
        }

        interaction.reply {
            embed {
                description = if (streak <= 0) {
                    context.locale[
                        "${roleplayData.action}.description",
                        roleplayData.giver.asMention,
                        roleplayData.receiver.asMention
                    ]
                } else {
                    context.locale[
                        "${roleplayData.action}.descriptionStreak",
                        roleplayData.giver.asMention,
                        roleplayData.receiver.asMention,
                        context.locale["roleplayStreak", streak.toString()],
                    ]
                }
                color = Colors.FOXY_DEFAULT
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
                        newStreak++
                        sendActionEmbed(context, nextInteraction, response, newStreak) {
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

    class RoleplayDataBuilder {
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