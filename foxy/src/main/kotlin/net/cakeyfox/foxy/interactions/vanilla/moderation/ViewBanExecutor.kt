package net.cakeyfox.foxy.interactions.vanilla.moderation

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.interactions.components.Container
import dev.minn.jda.ktx.interactions.components.Section
import dev.minn.jda.ktx.interactions.components.Separator
import dev.minn.jda.ktx.interactions.components.TextDisplay
import dev.minn.jda.ktx.interactions.components.Thumbnail
import dev.minn.jda.ktx.interactions.components.row
import dev.minn.jda.ktx.messages.InlineMessage
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.database.data.guild.TempBan
import net.cakeyfox.foxy.interactions.Type
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.componentMsg
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.interactions.vanilla.moderation.declarations.BanCommand
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.components.separator.Separator
import net.dv8tion.jda.api.entities.Guild
import net.dv8tion.jda.api.entities.User

class ViewBanExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val user = context.getOption("user", 0, User::class.java)!!

        val tempBan = context
            .getGuildData()
            ?.tempBans
            ?.find { it.userId == user.id }

        val banData = try {
            tempBan ?: context.guild
                ?.retrieveBan(user)
                ?.await()
        } catch (e: Exception) {
            null
        }

        when (banData) {
            is TempBan -> {
                val bannedBy = context.jda
                    .retrieveUserById(banData.bannedBy)
                    .await()

                context.reply {
                    buildMessage(
                        context = context,
                        user = user,
                        bannedBy = bannedBy,
                        reason = banData.reason,
                        tempBan = banData
                    )
                }
            }

            is Guild.Ban -> {
                context.reply {
                    buildMessage(
                        context = context,
                        user = user,
                        reason = banData.reason
                    )
                }
            }

            else -> {
                context.reply(true) {
                    content = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale[
                            "ban.manage.unknownBan",
                            user.effectiveName
                        ]
                    )
                }
            }
        }
    }

    private fun InlineMessage<*>.buildMessage(
        context: CommandContext,
        user: User,
        bannedBy: User? = null,
        reason: String? = null,
        tempBan: TempBan? = null,
        isDisabled: Boolean = false
    ) {
        useComponentsV2 = true

        val finalReason = reason ?: context.locale[
            "ban.manage.noReason"
        ]

        val banInfo = if (tempBan != null) {
            val unbanTime = context.utils
                .convertISOToDiscordTimestamp(tempBan.duration!!)

            componentMsg(
                Type.BOLD,
                context.locale[
                    "ban.manage.willBeUnbannedIn",
                    unbanTime
                ],
                FoxyEmotes.FoxyHowdy
            )
        } else {
            componentMsg(
                Type.BOLD,
                context.locale[
                    "ban.manage.bannedPermanently"
                ],
                FoxyEmotes.FoxyBan
            )
        }

        components += Container {

            accentColor = Colors.FOXY_DEFAULT

            +Section(Thumbnail(user.effectiveAvatarUrl)) {

                +TextDisplay(
                    componentMsg(
                        Type.SMALL_HEADER,
                        context.locale[
                            "ban.manage.userBan",
                            user.effectiveName
                        ]
                    )
                )

                +TextDisplay(banInfo)

                bannedBy?.let {
                    +TextDisplay(
                        componentMsg(
                            Type.BOLD,
                            context.locale[
                                "ban.manage.bannedBy",
                                "${it.name} (`${it.id}`)"
                            ],
                            FoxyEmotes.FoxyCake
                        )
                    )
                }
            }

            +Separator(true, Separator.Spacing.SMALL)

            +TextDisplay(
                componentMsg(
                    Type.BOLD,
                    context.locale[
                        "ban.manage.banReason"
                    ],
                    FoxyEmotes.FoxyDrinkingCoffee
                )
            )

            +TextDisplay("> $finalReason")

            +Separator(true, Separator.Spacing.SMALL)

            val label = if (tempBan != null)
                context.locale[
                    "ban.manage.button.banPermanently"
                ]
            else
                context.locale[
                    "ban.manage.button.applyTempBan"
                ]

            +row(
                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    style = ButtonStyle.DANGER,
                    emoji = FoxyEmotes.FoxyBan,
                    label = label
                ) {
                    it.edit {
                        buildMessage(
                            context,
                            user,
                            bannedBy,
                            reason,
                            tempBan,
                            true
                        )
                    }

                    if (tempBan != null) {
                        context.database.guild.removeTempBanFromGuild(context.guildId!!, user.id)

                        it.reply(true) {
                            content = pretty(
                                FoxyEmotes.FoxyBan,
                                context.locale[
                                    "ban.manage.convertBanToPermanently",
                                    user.effectiveName
                                ]
                            )
                        }
                    } else {
                        it.reply(true) {
                            buildSelectMenuMessage(
                                context,
                                user,
                                bannedBy,
                                reason,
                                pretty(
                                    FoxyEmotes.FoxyBan,
                                    context.locale[
                                        "ban.manage.convertBanToTemp",
                                        user.effectiveName
                                    ]
                                )
                            )
                        }
                    }
                }.withDisabled(isDisabled),

                context.foxy.interactionManager.createButtonForUser(
                    context.user,
                    ButtonStyle.PRIMARY,
                    FoxyEmotes.FoxyWow,
                    label = context.locale[
                        "ban.manage.button.removeBan"
                    ]
                ) {
                    it.edit {
                        buildMessage(
                            context,
                            user,
                            bannedBy,
                            reason,
                            tempBan,
                            true
                        )
                    }

                    val banData = context.guild!!.retrieveBan(user).await()

                    if (banData == null) {
                        it.reply(true) {
                            content = pretty(
                                FoxyEmotes.FoxyDrinkingCoffee,
                                context.locale[
                                    "ban.manage.userIsNotBanned"
                                ]
                            )
                        }

                        return@createButtonForUser
                    }

                    it.reply(true) {
                        content = pretty(
                            FoxyEmotes.FoxyYay,
                            context.locale[
                                "ban.manage.userUnbanned",
                                user.effectiveName
                            ]
                        )
                    }

                    context.guild!!.unban(user)
                        .reason(
                            context.locale[
                                "ban.manage.userUnbannedBy",
                                "${context.user.name} (${context.user.id})"
                            ]
                        )
                        .await()
                }.withDisabled(isDisabled)
            )
        }
    }

    private fun InlineMessage<*>.buildSelectMenuMessage(
        context: CommandContext,
        user: User,
        bannedBy: User? = null,
        reason: String? = null,
        content: String,
        isDisabled: Boolean = false
    ) {
        this.content = content

        actionRow(
            context.foxy.interactionManager.stringSelectMenuForUser(
                target = context.user,
                builder = {
                    BanCommand.banTimeOptions.forEach { (name, value) ->
                        if (value != 0L) {
                            addOption(name, value.toString())
                        }
                    }
                },
            ) { context, strings ->
                val selectedDuration = strings.first().toLong()
                val durationInstant = Instant.fromEpochMilliseconds(
                    Clock.System.now().toEpochMilliseconds() + selectedDuration
                )
                val durationToDiscordTimestamp = context.utils.convertISOToExtendedDiscordTimestamp(durationInstant)

                context.foxy.database.guild.addTempBanToGuild(
                    context.guildId!!,
                    TempBan(
                        userId = user.id,
                        reason = reason ?: context.locale[
                            "ban.manage.noReason"
                        ],
                        bannedBy = context.user.id,
                        duration = durationInstant
                    )
                )

                context.edit {
                    buildSelectMenuMessage(
                        context,
                        user,
                        bannedBy,
                        reason,
                        pretty(
                            FoxyEmotes.FoxyBan,
                            context.locale[
                                "ban.manage.convertedBanToTemp",
                                user.effectiveName,
                                durationToDiscordTimestamp
                            ]
                        ),
                        true
                    )
                }

            }.withDisabled(isDisabled)
        )
    }
}