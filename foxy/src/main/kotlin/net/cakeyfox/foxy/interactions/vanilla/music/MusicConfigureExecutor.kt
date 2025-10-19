package net.cakeyfox.foxy.interactions.vanilla.music

import dev.minn.jda.ktx.interactions.components.Container
import dev.minn.jda.ktx.interactions.components.MediaGallery
import dev.minn.jda.ktx.interactions.components.Section
import dev.minn.jda.ktx.interactions.components.Separator
import dev.minn.jda.ktx.interactions.components.TextDisplay
import dev.minn.jda.ktx.interactions.components.row
import dev.minn.jda.ktx.messages.InlineMessage
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.cakeyfox.foxy.utils.PremiumUtils
import net.cakeyfox.foxy.utils.linkButton
import net.dv8tion.jda.api.components.buttons.Button
import net.dv8tion.jda.api.components.buttons.ButtonStyle
import net.dv8tion.jda.api.components.mediagallery.MediaGalleryItem
import net.dv8tion.jda.api.components.selections.EntitySelectMenu
import net.dv8tion.jda.api.components.separator.Separator
import net.dv8tion.jda.api.entities.channel.ChannelType

class MusicConfigureExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        val guildData = context.foxy.database.guild.getGuild(context.guildId!!)

        context.reply {
            useComponentsV2 = true
            renderMusicConfigurePage(context, guildData)
        }
    }

    private fun InlineMessage<*>.renderMusicConfigurePage(context: CommandContext, guildData: Guild) {
        val requestChannel = if (guildData.musicSettings?.requestMusicChannel != null)
            "<#${guildData.musicSettings?.requestMusicChannel}>"
        else
            context.locale["music.configure.notConfigured"]

        val is247Enabled = guildData.musicSettings?.is247ModeEnabled ?: false
        val is247EnabledFormatted =
            if (is247Enabled) context.locale["music.configure.enabled"] else context.locale["music.configure.disabled"]
        val enable247ButtonField = if (is247Enabled)
            context.locale["music.configure.twentyFourSeven.disableButton"]
        else
            context.locale["music.configure.twentyFourSeven.enableButton"]

        components += Container {
            accentColor = Colors.BLUE

            +MediaGallery {
                +MediaGalleryItem.fromUrl(Constants.FOXY_BANNER)
            }

            +Separator(true, Separator.Spacing.SMALL)
            +Section(createConfigureRequestChannelButton(context)) {
                +TextDisplay(context.locale["music.configure.requestChannel.description"])
                +TextDisplay("-# ${context.locale["music.configure.requestChannel.current", requestChannel]}")
            }

            +Separator(true, Separator.Spacing.SMALL)
            +Section(createEnable247Button(context, enable247ButtonField)) {
                +TextDisplay(context.locale["music.configure.twentyFourSeven.description"])
                +TextDisplay(
                    "-# ${context.locale["music.configure.twentyFourSeven.current", is247EnabledFormatted]}"
                )
            }
        }
    }

    private fun createConfigureRequestChannelButton(context: CommandContext): Button {
        return context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.PRIMARY,
            FoxyEmotes.PaintBrush,
            context.locale["music.configure.requestChannel.button"]
        ) {
            val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
            val currentChannel = guildData.musicSettings?.requestMusicChannel
            it.reply(true) {
                content = context.locale["music.configure.requestChannel.description"]
                components += row(
                    context.foxy.interactionManager.entitySelectMenuForUser(
                        context.user,
                        EntitySelectMenu.SelectTarget.CHANNEL,
                        builder = {
                            setChannelTypes(ChannelType.TEXT)
                            setMaxValues(1)
                            setPlaceholder(
                                context.locale[
                                    "music.configure.requestChannel.current",
                                    currentChannel ?: context.locale["music.configure.notConfigured"]
                                ]
                            )
                        },
                    ) { selectMenuContext, strings ->
                        val channel = strings.first()

                        context.database.guild.updateGuild(context.guildId!!) {
                            musicSettings.requestMusicChannel = channel.id
                        }

                        selectMenuContext.deferEdit()
                        val updatedGuildData = context.foxy.database.guild.getGuild(context.guildId!!)
                        context.edit {
                            useComponentsV2 = true
                            renderMusicConfigurePage(context, updatedGuildData)
                        }
                    }
                )
            }
        }
    }

    private fun createEnable247Button(context: CommandContext, buttonLabel: String): Button {
        return context.foxy.interactionManager.createButtonForUser(
            context.user,
            ButtonStyle.PRIMARY,
            FoxyEmotes.PaintBrush,
            buttonLabel
        ) {
            val guildData = context.foxy.database.guild.getGuild(context.guildId!!)
            val isEnabled = guildData.musicSettings?.is247ModeEnabled ?: false

            if (!PremiumUtils.eligibleFor247Mode(context)) {
                it.reply(true) {
                    embed {
                        color = Colors.FOXY_DEFAULT
                        title = pretty(
                            FoxyEmotes.FoxyCry,
                            context.locale["music.configure.twentyFourSeven.premiumOnly.title"]
                        )
                        description = context.locale["music.configure.twentyFourSeven.premiumOnly.description"]
                    }

                    components += row(
                        linkButton(
                            FoxyEmotes.FoxyYay,
                            context.locale["music.configure.upgradeToPremium"],
                            Constants.PREMIUM
                        )
                    )
                }
                return@createButtonForUser
            }

            context.database.guild.updateGuild(context.guildId!!) {
                musicSettings.is247ModeEnabled = !isEnabled
            }

            it.deferEdit()
            val updatedGuildData = context.foxy.database.guild.getGuild(context.guildId!!)
            context.edit {
                useComponentsV2 = true
                renderMusicConfigurePage(context, updatedGuildData)
            }
        }
    }
}