package net.cakeyfox.foxy.interactions

fun pretty(emoji: String, content: String, separator: String? = "**|**"): String = "$emoji $separator $content"

fun componentMsg(type: Type, content: String, emoji: String? = null): String {
    val size = when (type) {
        Type.NONE -> ""
        Type.BIG_HEADER -> "#"
        Type.MEDIUM_HEADER -> "##"
        Type.SMALL_HEADER -> "###"
        Type.SUBTEXT -> "-#"
        Type.BOLD -> {
            return if (emoji != null) {
                "**$emoji | $content**"
            } else "**$content**"
        }
    }

    if (emoji != null) {
        return "$size $emoji **|** $content"
    } else return "$size $content"
}

enum class Type {
    BIG_HEADER,
    MEDIUM_HEADER,
    SMALL_HEADER,
    SUBTEXT,
    BOLD,
    NONE
}