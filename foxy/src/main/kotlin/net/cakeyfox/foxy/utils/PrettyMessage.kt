package net.cakeyfox.foxy.utils

fun pretty(emoji: String, content: String, isUnicode: Boolean = false): String {
    if (isUnicode) {
        return "$emoji **|** $content"
    }
    return "<:emoji:$emoji> **|** $content"
}