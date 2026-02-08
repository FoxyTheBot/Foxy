package net.cakeyfox.foxy.interactions.vanilla.discord

import dev.minn.jda.ktx.coroutines.await
import dev.minn.jda.ktx.interactions.components.Container
import dev.minn.jda.ktx.interactions.components.MediaGallery
import dev.minn.jda.ktx.interactions.components.Section
import dev.minn.jda.ktx.interactions.components.Separator
import dev.minn.jda.ktx.interactions.components.TextDisplay
import dev.minn.jda.ktx.interactions.components.Thumbnail
import dev.minn.jda.ktx.interactions.components.row
import kotlinx.datetime.toKotlinInstant
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.Type
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.componentMsg
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.components.actionrow.ActionRowChildComponent
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.components.mediagallery.MediaGalleryItem
import net.dv8tion.jda.api.components.separator.Separator
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.events.interaction.command.UserContextInteractionEvent
import kotlin.jvm.java

class UserInfoExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val user = when (context.event) {
            is UserContextInteractionEvent -> (context.event as UserContextInteractionEvent).target
            else -> context.getOption("user", 0, User::class.java) ?: context.user
        }
        val userProfile = user.retrieveProfile().await()
        val joinDate =
            context.utils.convertISOToExtendedDiscordTimestamp(user.timeCreated.toInstant().toKotlinInstant())
        val userAsMember = try {
            context.guild?.retrieveMember(user)?.await()
        } catch (_: Exception) {
            null
        }

        context.reply {
            useComponentsV2 = true
            components += Container {
                accentColor = Colors.FOXY_DEFAULT

                if (userProfile.bannerUrl != null) {
                    +MediaGallery {
                        +MediaGalleryItem.fromUrl(userProfile.bannerUrl!! + "?size=512")
                    }

                    +Separator(true, Separator.Spacing.SMALL)
                }

                +Section(Thumbnail(user.effectiveAvatarUrl + "?size=512")) {
                    +TextDisplay(
                        componentMsg(
                            Type.MEDIUM_HEADER,
                            context.locale[
                                "user.info.userInformation",
                                user.effectiveName
                            ],
                            FoxyEmotes.FoxyDaily
                        )
                    )

                    +TextDisplay(
                        componentMsg(
                            Type.NONE,
                            context.locale[
                                "user.info.userId",
                                user.id
                            ],
                            FoxyEmotes.FoxyIdPurple,
                            ""
                        )
                    )

                    +TextDisplay(
                        componentMsg(
                            Type.NONE,
                            context.locale[
                                "user.info.username",
                                "@${user.name}"
                            ],
                            FoxyEmotes.FoxyHowdy,
                            ""
                        )
                    )
                }

                if (userAsMember != null) {
                    +Separator(true, Separator.Spacing.SMALL)

                    +TextDisplay(
                        componentMsg(
                            Type.NONE,
                            context.locale[
                                "user.info.roles",
                                userAsMember.roles.take(5).joinToString(",") { it.asMention },
                            ],
                            FoxyEmotes.FoxyHm,
                            ""
                        )
                    )

                    +TextDisplay(
                        componentMsg(
                            Type.NONE,
                            context.locale[
                                "user.info.isBoosting",
                                when (userAsMember.isBoosting) {
                                    true -> context.locale["yes"]
                                    false -> context.locale["no"]
                                }
                            ],
                            FoxyEmotes.FoxyBread,
                            ""
                        )
                    )

                    +TextDisplay(
                        componentMsg(
                            Type.NONE,
                            context.locale[
                                "user.info.isOwner",
                                when (userAsMember.isOwner) {
                                    true -> context.locale["yes"]
                                    false -> context.locale["no"]
                                }
                            ],
                            FoxyEmotes.FoxyNice,
                            ""
                        )
                    )
                }

                +Separator(true, Separator.Spacing.SMALL)
                +TextDisplay(
                    componentMsg(
                        Type.NONE,
                        context.locale[
                            "user.info.onDiscordSince",
                            joinDate
                        ],
                        FoxyEmotes.FoxyWow,
                        ""
                    )
                )

                if (userAsMember != null) {
                    val memberJoinDate = context.utils.convertISOToExtendedDiscordTimestamp(
                        userAsMember.timeJoined.toInstant().toKotlinInstant()
                    )
                    +TextDisplay(
                        componentMsg(
                            Type.NONE,
                            context.locale[
                                "user.info.memberSince",
                                memberJoinDate
                            ],
                            FoxyEmotes.FoxyCake,
                            ""
                        )
                    )
                }

                val moderatorActions = buildList {
                    val member = context.member ?: return@buildList

                    if (member.hasPermission(Permission.BAN_MEMBERS)) {
                        add(
                            context.foxy.interactionManager.createButtonForUser(
                                context.user,
                                ButtonStyle.DANGER,
                                FoxyEmotes.FoxyBan,
                                "Banir"
                            ) {
                                // TODO: Add ban logic
                            }
                        )
                    }

                    if (member.hasPermission(Permission.KICK_MEMBERS)) {
                        add(
                            context.foxy.interactionManager.createButtonForUser(
                                context.user,
                                ButtonStyle.DANGER,
                                FoxyEmotes.FoxyRage,
                                "Expulsar"
                            ) {
                                // TODO: Add kick logic
                            }
                        )
                    }
                }

                if (moderatorActions.isNotEmpty()) {

                    +Separator(true, Separator.Spacing.SMALL)
                    +TextDisplay(
                        componentMsg(
                            Type.SMALL_HEADER,
                            "Ações de Moderador",
                            FoxyEmotes.FoxyBan
                        )
                    )
                    +row(*moderatorActions.toTypedArray())
                }

                +Separator(true, Separator.Spacing.SMALL)
                +TextDisplay(
                    componentMsg(
                        Type.SMALL_HEADER,
                        "Ações Gerais",
                        FoxyEmotes.FoxyHm
                    )
                )
                +row(
                    context.foxy.interactionManager.createButtonForUser(
                        context.user,
                        ButtonStyle.PRIMARY,
                        FoxyEmotes.FoxyWow,
                        "Ver Avatar"
                    ) {
                        // TODO: Add view avatar logic
                    },

                    context.foxy.interactionManager.createButtonForUser(
                        context.user,
                        ButtonStyle.PRIMARY,
                        FoxyEmotes.FoxyCake,
                        "Ver Banner"
                    ) {
                        // TODO: Add view banner logic
                    }.withDisabled(userProfile.bannerUrl == null),
                )
            }
        }
    }
}