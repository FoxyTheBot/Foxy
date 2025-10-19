package net.cakeyfox.foxy.interactions.vanilla.utils

import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.interactions.commands.CommandContext
import net.cakeyfox.foxy.interactions.commands.UnleashedCommandExecutor
import net.cakeyfox.foxy.interactions.pretty
import net.dv8tion.jda.api.entities.emoji.Emoji

class LanguageExecutor : UnleashedCommandExecutor() {
    override suspend fun execute(context: CommandContext) {
        context.reply {
            embed {
                title = pretty(FoxyEmotes.FoxyYay, context.locale["language.embed.title"])
                description = context.locale["language.embed.description", FoxyEmotes.FlagBr, FoxyEmotes.FlagUs]
                color = Colors.FOXY_DEFAULT
                thumbnail = Constants.FOXY_WOW
            }

            actionRow(
                context.foxy.interactionManager.stringSelectMenuForUser(
                    context.user,
                    builder = {
                        addOption(
                            "Português do Brasil",
                            "pt-BR",
                            Emoji.fromUnicode(FoxyEmotes.FlagBr)
                        )

                        addOption(
                            "English",
                            "en-US",
                            Emoji.fromUnicode(FoxyEmotes.FlagUs)
                        )
                    },

                    ) { ctx, strings ->
                    val selectedLanguage = strings.first()

                    ctx.deferEdit()
                    ctx.edit {
                        embed {
                            title = pretty(FoxyEmotes.FoxyYay, context.locale["language.embed.title"])
                            description = context.locale["language.$selectedLanguage"]
                            color = Colors.FOXY_DEFAULT
                            thumbnail = Constants.FOXY_WOW
                        }
                    }

                    context.database.guild.updateGuild(context.guildId!!) {
                        guildSettings.language = selectedLanguage
                    }
                }
            )
        }
    }
}