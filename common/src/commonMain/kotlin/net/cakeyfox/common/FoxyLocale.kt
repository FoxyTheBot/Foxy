package net.cakeyfox.common

@Suppress("EXPECT_ACTUAL_CLASSIFIERS_ARE_IN_BETA_WARNING")
expect class FoxyLocale(locale: String) {
    var locale: String
    val language: String

    operator fun get(key: String, vararg placeholder: String): String
}