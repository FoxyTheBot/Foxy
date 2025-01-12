package net.cakeyfox.foxy.modules.antiraid.utils

object AntiRaidUtils {
    fun hasExcessiveRepeatedSequences(message: String, limit: Int): Boolean {
        if (message.isBlank()) return false

        val normalizedMessage = message.trim().lowercase()

        var charRepetitionCount = 1
        var maxCharRepetition = 1
        for (i in 1 until normalizedMessage.length) {
            if (normalizedMessage[i] == normalizedMessage[i - 1]) {
                charRepetitionCount++
                maxCharRepetition = maxOf(maxCharRepetition, charRepetitionCount)
            } else {
                charRepetitionCount = 1
            }
        }

        if (maxCharRepetition > limit) {
            return true
        }

        val words = normalizedMessage.split("\\s+".toRegex())
        val wordFrequency = mutableMapOf<String, Int>()

        for (word in words) {
            val condensedWord = word.replace(Regex("(.)\\1+"), "$1")
            wordFrequency[condensedWord] = wordFrequency.getOrDefault(condensedWord, 0) + 1
            if (wordFrequency[condensedWord]!! > limit) {
                return true
            }
        }

        for (patternLength in 1..(normalizedMessage.length / 2)) {
            val pattern = normalizedMessage.substring(0, patternLength)
            val repeatedPattern = pattern.repeat(limit + 1)
            if (normalizedMessage.startsWith(repeatedPattern)) {
                return true
            }
        }

        return false
    }
}