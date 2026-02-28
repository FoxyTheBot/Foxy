package net.cakeyfox.foxy.interactions

fun pretty(emoji: String, content: String, separator: String? = "**|**"): String = "$emoji $separator $content"

fun componentMsg(type: Type, content: String, emoji: String? = null, separator: String? = "•"): String {
    val size = when (type) {
        Type.NONE -> ""
        Type.BIG_HEADER -> "#"
        Type.MEDIUM_HEADER -> "##"
        Type.SMALL_HEADER -> "###"
        Type.SUBTEXT -> "-#"
        Type.BOLD -> {
            return if (emoji != null) {
                if (separator?.isEmpty() == true) return "$emoji $content"
                "**$emoji $separator $content**"
            } else "**$content**"
        }
    }

    if (emoji != null) {
        if (separator?.isEmpty() == true) return "$size $emoji $content"
        return "$size $emoji $separator $content"
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