package net.cakeyfox.common

@Suppress(names = ["EXPECT_ACTUAL_CLASSIFIERS_ARE_IN_BETA_WARNING"])
actual class FoxyLocale actual constructor(locale: String) {
    actual var locale: String
        get() = TODO("Not yet implemented")
        set(value) {}
    actual val language: String
        get() = TODO("Not yet implemented")

    actual operator fun get(key: String, vararg placeholder: String): String {
        TODO("Not yet implemented")
    }
}