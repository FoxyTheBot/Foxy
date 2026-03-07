package net.cakeyfox.foxy.utils

enum class PremiumType(val value: String) {
    FREE("0"),
    TIER1("1"),
    TIER2("2"),
    TIER3("3"),
    PARTNER("4"),

    TIER1_LEGACY("Foxy Premium I"),
    TIER2_LEGACY("Foxy Premium II"),
    TIER3_LEGACY("Foxy Premium III");

    companion object {
        private val valueMap = PremiumType.entries.associateBy { it.value }
        private val nameMap = PremiumType.entries.associateBy { it.name }

        fun fromDb(value: String): PremiumType {
            return valueMap[value]
                ?: nameMap[value]
                ?: when (value) {
                    "Foxy Premium I" -> TIER1
                    "Foxy Premium II" -> TIER2
                    "Foxy Premium III" -> TIER3
                    else -> FREE
                }
        }
    }
}