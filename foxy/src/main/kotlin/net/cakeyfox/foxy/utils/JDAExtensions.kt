package net.cakeyfox.foxy.utils

import net.dv8tion.jda.api.entities.emoji.Emoji
import net.dv8tion.jda.api.interactions.components.buttons.Button
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle

fun linkButton(
    emoji: String? = null,
    label: String = "",
    url: String,
): Button {
    return Button.of(
        ButtonStyle.LINK,
        url,
        label,
        emoji?.let { Emoji.fromFormatted(it) }
    )
}