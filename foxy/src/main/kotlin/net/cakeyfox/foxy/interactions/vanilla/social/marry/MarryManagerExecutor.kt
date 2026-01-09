package net.cakeyfox.foxy.interactions.vanilla.social.marry

import dev.minn.jda.ktx.interactions.components.Container
import dev.minn.jda.ktx.interactions.components.InlineContainer
import dev.minn.jda.ktx.interactions.components.Separator
import dev.minn.jda.ktx.interactions.components.TextDisplay
import dev.minn.jda.ktx.interactions.components.TextInput
import dev.minn.jda.ktx.interactions.components.row
import kotlinx.datetime.Instant
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.database.common.data.marry.Marry
import net.cakeyfox.foxy.interactions.Type
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.componentMsg
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.components.separator.Separator
import net.dv8tion.jda.api.components.textinput.TextInput
import net.dv8tion.jda.api.components.textinput.TextInputStyle
import net.dv8tion.jda.api.entities.User

class MarryManagerExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val isNotMarried = context.database.user.getMarriage(context.userId) == null
        val marriageInfo = context.database.user.getMarriage(context.userId)
        val partnerId = marriageInfo?.let { marriage ->
            when (context.userId) {
                marriage.firstUser.id -> marriage.secondUser.id
                marriage.secondUser.id -> marriage.firstUser.id
                else -> null
            }
        }

        context.reply {
            useComponentsV2 = true

            components += Container {
                accentColor = Colors.FOXY_DEFAULT


                +TextDisplay(
                    componentMsg(
                        Type.SMALL_HEADER,
                        context.locale["marry.manager.marriageState"],
                        FoxyEmotes.Ring
                    )
                )

                if (isNotMarried) {
                    buildNotMarriedComponent(context)
                } else {
                    val user = context.jda.retrieveUserById(partnerId!!).complete()
                    buildMarriedComponent(context, user, marriageInfo)
                }
            }
        }
    }

    private fun InlineContainer.buildMarriedComponent(
        context: CommandContext,
        marriedWith: User,
        marriageInfo: Marry,
        disableButtons: Boolean? = false
    ) {
        val formattedDate = context.utils.convertISOToExtendedDiscordTimestamp(marriageInfo.marriedDate!!)
        val userLetters = marriageInfo.run {
            if (firstUser.id == context.userId) firstUser.letterCount else secondUser.letterCount
        }
        val partnerLetters = marriageInfo.run {
            if (firstUser.id == context.userId) secondUser.letterCount else firstUser.letterCount
        }

        val customName = marriageInfo.marriageName ?: "Não Definido"
        +TextDisplay(
            componentMsg(
                Type.BOLD,
                context.locale["marry.manager.marriageName"]
            ) + customName
        )
        +TextDisplay(
            componentMsg(
                Type.BOLD,
                context.locale["marry.manager.marriedWith", marriedWith.asMention]
            )
        )
        +TextDisplay(
            componentMsg(
                Type.BOLD,
                context.locale["marry.manager.marriedSince", formattedDate]
            )
        )

        +Separator(false, Separator.Spacing.SMALL)

        +TextDisplay(
            componentMsg(
                Type.SMALL_HEADER,
                context.locale["marry.manager.stats"], FoxyEmotes.FoxyWow
            )
        )

        +TextDisplay(
            """
            ${context.locale["marry.manager.userLetters", context.user.effectiveName, "**${userLetters}**"]}
            ${context.locale["marry.manager.userLetters", marriedWith.effectiveName, "**${partnerLetters}**"]}
            ${context.locale["marry.manager.affinityPoints", "**${marriageInfo.affinityPoints}**"]}
        """.trimIndent()
        )
        +TextDisplay(
            """
            ${context.locale["marry.manager.doRoleplayAndSendLettersToGetMoreAffinityPoints"]}
        """.trimIndent()
        )

        +Separator(true, Separator.Spacing.LARGE)

        +row(
            context.foxy.interactionManager.createButtonForUser(
                context.user,
                ButtonStyle.PRIMARY,
                FoxyEmotes.PaintBrush,
                context.locale["marry.manager.buttons.editMarriageName"]
            ) {

                it.sendModal(
                    context.foxy.interactionManager.createModal(
                        title = context.locale["marry.manager.modals.marriageName"],
                        builder = {
                            val name = TextInput.create(
                                "marriageName",
                                context.locale["marry.manager.modals.editMarriageName"],
                                TextInputStyle.SHORT
                            )
                                .setRequired(true)
                                .setMaxLength(2)
                                .setMaxLength(15)
                                .build()

                            components = listOf(row(name))
                        })
                    { modalContext ->
                        modalContext.deferEdit()
                        val marriageName = modalContext.getValue("marriageName")!!.asString

                        context.foxy.database.user.updateMarriage(context.user.id) {
                            this.marriageName = marriageName
                            this.decAffinityPoints(20)
                        }
                        val updatedMarriageInfo = context.database.user.getMarriage(context.userId)
                            ?: return@createModal

                        context.edit {
                            useComponentsV2 = true

                            components += Container {
                                accentColor = Colors.FOXY_DEFAULT


                                +TextDisplay(
                                    componentMsg(
                                        Type.SMALL_HEADER,
                                        context.locale["marry.manager.marriageState"],
                                        FoxyEmotes.Ring
                                    )
                                )

                                buildMarriedComponent(context, marriedWith, updatedMarriageInfo)
                            }
                        }
                    }
                )
            }.withDisabled(marriageInfo.affinityPoints <= 20 || disableButtons == true),
        )
    }

    private fun InlineContainer.buildNotMarriedComponent(context: CommandContext) {
        +TextDisplay(
            pretty(
                FoxyEmotes.FoxyCry, context.locale["marry.manager.youAreNotMarried"]
            )
        )

        +Separator(true, Separator.Spacing.SMALL)

        +row(
            context.foxy.interactionManager.createButtonForUser(
                context.user,
                style = ButtonStyle.DANGER,
                emoji = FoxyEmotes.Locked,
                label = context.locale["marry.manager.blockRequests"]
            ) {
                val isMarriageBlocked = context.getAuthorData().marryStatus.cantMarry
                context.database.user.updateUser(context.user.id) {
                    marryStatus.cantMarry = !isMarriageBlocked
                }

                it.reply(true) {
                    val isNowLocked = !isMarriageBlocked
                    content = if (isNowLocked) {
                        pretty(
                            FoxyEmotes.Locked,
                            context.locale["marry.manager.okYouWontReceiveAnyRequests"]
                        )
                    } else {
                        pretty(
                            FoxyEmotes.Unlocked,
                            context.locale["marry.manager.okYouWillReceiveAnyRequests"]
                        )
                    }
                }
            }
        )
    }
}