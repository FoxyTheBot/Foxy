package net.cakeyfox.foxy.interactions.vanilla.social

import dev.minn.jda.ktx.messages.InlineMessage
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.database.data.Badge
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.profile.ProfileUtils
import net.dv8tion.jda.api.entities.emoji.Emoji
import net.dv8tion.jda.api.interactions.components.ActionComponent
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

class ProfileBadgesExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val data = context.getAuthorData()
        val badges = ProfileUtils.getBadgeAssets(data, context.user, context)
        if (badges.isEmpty()) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["profile.badges.youDontHaveAnyBadge"])
            }

            return
        }
        showBadgeMenu(context, badges, isInitial = true)
    }

    private suspend fun showBadgeMenu(
        context: CommandContext,
        badges: List<Badge>,
        isInitial: Boolean = false
    ) {
        suspend fun buildMenuContent(builder: InlineMessage<*>.() -> Unit) {
            if (isInitial) {
                context.reply { builder() }
            } else {
                context.edit(builder)
            }
        }

        buildMenuContent {
            embed {
                title = context.locale["profile.badges.title"]
                description = context.locale["profile.badges.description"]
                color = Colors.FOXY_DEFAULT
            }

            actionRow(
                context.foxy.interactionManager.stringSelectMenuForUser(
                    context.user,
                    builder = {
                        for (badge in badges) {
                            val assetName = badge.asset.removeSuffix(".png").lowercase()
                            val emojiFormatted = FoxyEmotes.badgesMap[assetName] ?: ""

                            addOption(
                                badge.name,
                                badge.id,
                                badge.description,
                                Emoji.fromFormatted(emojiFormatted)
                            )
                        }
                    }
                ) { ctx, strings ->
                    val selectedId = strings.first()
                    val selectedBadge = badges.find { it.id == selectedId } ?: return@stringSelectMenuForUser

                    val disabledBadges = context.getAuthorData().userProfile.disabledBadges
                    val selectedBadgeId = selectedBadge.id

                    ctx.edit {
                        embed {
                            title = selectedBadge.name
                            description = selectedBadge.description
                            thumbnail = Constants.getProfileBadge(selectedBadge.asset)
                            color = Colors.FOXY_DEFAULT
                        }
                        
                        actionRow(*buildBadgeButtons(context, disabledBadges, selectedBadgeId, badges).toTypedArray())
                    }
                }
            )
        }
    }

    private fun buildBadgeButtons(
        context: CommandContext,
        disabledBadges: List<String>?,
        selectedBadgeId: String,
        badges: List<Badge>
    ): List<ActionComponent> {
        val isDisabled = disabledBadges?.contains(selectedBadgeId) == true

        return listOf(
            context.foxy.interactionManager.createButtonForUser(
                context.user,
                ButtonStyle.SECONDARY,
                FoxyEmotes.FoxyOk,
                context.locale["profile.badges.back"]
            ) {
                showBadgeMenu(it, badges)
            },

            context.foxy.interactionManager.createButtonForUser(
                context.user,
                if (isDisabled) ButtonStyle.SUCCESS else ButtonStyle.DANGER,
                FoxyEmotes.FoxyOk,
                if (isDisabled) context.locale["profile.badges.showBadge"] else context.locale["profile.badges.hideBadge"]
            ) {
                if (isDisabled) {
                    enableBadge(context, it, selectedBadgeId, badges)
                } else {
                    disableBadge(context, it, selectedBadgeId, badges)
                }
            }
        )
    }

    private suspend fun enableBadge(
        context: CommandContext,
        componentContext: CommandContext,
        selectedBadgeId: String,
        badges: List<Badge>
    ) {
        val disabledBadges = context.getAuthorData().userProfile.disabledBadges ?: return
        if (!disabledBadges.contains(selectedBadgeId)) return

        val updatedDisabledBadges = disabledBadges.filterNot { it == selectedBadgeId }

        context.database.user.updateUser(
            context.user.id,
            mapOf("userProfile.disabledBadges" to updatedDisabledBadges)
        )

        val newDisabledBadges = context.getAuthorData().userProfile.disabledBadges

        componentContext.edit {
            actionRow(*buildBadgeButtons(context, newDisabledBadges, selectedBadgeId, badges).toTypedArray())
        }
    }

    private suspend fun disableBadge(
        context: CommandContext,
        componentContext: CommandContext,
        selectedBadgeId: String,
        badges: List<Badge>
    ) {
        val disabledBadges = context.getAuthorData().userProfile.disabledBadges

        val updatedDisabledBadges = if (disabledBadges == null) {
            listOf(selectedBadgeId)
        } else {
            if (disabledBadges.contains(selectedBadgeId)) return
            disabledBadges + selectedBadgeId
        }

        context.database.user.updateUser(
            context.user.id,
            mapOf("userProfile.disabledBadges" to updatedDisabledBadges)
        )

        val newDisabledBadges = context.getAuthorData().userProfile.disabledBadges

        componentContext.edit {
            actionRow(*buildBadgeButtons(context, newDisabledBadges, selectedBadgeId, badges).toTypedArray())
        }
    }
}