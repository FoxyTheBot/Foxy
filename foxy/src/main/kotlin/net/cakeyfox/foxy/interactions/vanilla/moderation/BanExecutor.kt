package net.cakeyfox.foxy.interactions.vanilla.moderation

import dev.minn.jda.ktx.messages.InlineMessage
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.AdminUtils.banUsers
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.entities.UserSnowflake

class BanExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.defer()
        val users = context.getOption("users", 0, String::class.java)
        val durationInMs = context.getOption("time", 0, Long::class.java) ?: 0
        val skipConfirmation = context.getOption("skip_confirmation", 0, Boolean::class.java) ?: false
        val reason = context.getOption("reason", 0, String::class.java) ?: "Motivo não definido"

        val validUsers = if (users != null) {
            val validUsers = context.utils.checkValidUsersFromString(context, users)?.validUsers
                ?: return sendHelpEmbed(context)

            if (validUsers.isEmpty() && users.isEmpty()) {
                return sendHelpEmbed(context)
            }

            validUsers
        } else emptyList()

        val userAsSnowflakes = validUsers.map { UserSnowflake.fromId(it.idLong) }
        val validUserUsernames = validUsers.map { "`@${it.name} (${it.id})`" }
        val durationToDiscordTimestamp = context.utils.convertISOToExtendedDiscordTimestamp(
            Instant.fromEpochMilliseconds(
                Clock.System.now().toEpochMilliseconds() + durationInMs
            )
        )


        if (!skipConfirmation) {
            context.reply {
                content = if (durationInMs > 0) {
                    pretty(
                        FoxyEmotes.FoxyBan,
                        context.locale[
                            "ban.confirmPunishment",
                            validUserUsernames.joinToString(", "),
                            durationToDiscordTimestamp
                        ]
                    )
                } else {
                    pretty(
                        FoxyEmotes.FoxyBan,
                        context.locale[
                            "ban.confirmPermanentPunishment",
                            validUserUsernames.joinToString(", ")
                        ]
                    )
                }

                actionRow(
                    context.foxy.interactionManager.createButtonForUser(
                        context.user,
                        ButtonStyle.DANGER,
                        FoxyEmotes.FoxyBan,
                        context.locale["ban.buttons.confirmPunishment"]
                    ) {
                        it.deferEdit()
                        context.edit {
                            actionRow(
                                context.foxy.interactionManager.createButtonForUser(
                                    context.user,
                                    ButtonStyle.DANGER,
                                    FoxyEmotes.FoxyBan,
                                    context.locale["ban.buttons.confirmPunishment"]
                                ) {}.asDisabled()
                            )
                        }

                        it.reply(true) {
                            content = pretty(
                                FoxyEmotes.FoxyBan,
                                context.locale[
                                    "ban.bannedUsers",
                                    validUserUsernames.joinToString(", ")
                                ]
                            )
                        }

                        banUsers(
                            context.foxy,
                            context.guildId!!,
                            userAsSnowflakes,
                            reason,
                            context.user,
                            durationInMs
                        )
                    }
                )
            }
        } else {
            context.reply {
                content = pretty(
                    FoxyEmotes.FoxyBan,
                    context.locale[
                        "ban.bannedUsers",
                        validUserUsernames.joinToString(", ")
                    ]
                )
            }

            banUsers(
                context.foxy,
                context.guildId!!,
                userAsSnowflakes, reason,
                context.user,
                durationInMs
            )
        }
    }

    private suspend fun sendHelpEmbed(context: CommandContext) {
        context.reply(true) {
            embed {
                color = Colors.FOXY_DEFAULT
                title = pretty(FoxyEmotes.FoxyRage, context.locale["ban.howToUse.title"])
                description = context.locale["ban.howToUse.description"]

                field(
                    context.locale["ban.howToUse.params.users.title"],
                    context.locale["ban.howToUse.params.users.description"],
                    inline = false
                )
                field(
                    context.locale["ban.howToUse.params.duration.title"],
                    context.locale["ban.howToUse.params.duration.description"],
                    inline = false
                )
                field(
                    context.locale["ban.howToUse.params.reason.title"],
                    context.locale["ban.howToUse.params.reason.description"],
                    inline = false
                )
                field(
                    context.locale["ban.howToUse.params.skip_confirmation.title"],
                    context.locale["ban.howToUse.params.skip_confirmation.description"],
                    inline = false
                )

                footer(context.locale["howToUseParams"])
            }
        }
    }
}