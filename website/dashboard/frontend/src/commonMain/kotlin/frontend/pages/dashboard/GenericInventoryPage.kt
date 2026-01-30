package frontend.pages.dashboard

import frontend.utils.buildUserInventory
import net.cakeyfox.common.FoxyLocale
import net.cakeyfox.serializable.data.website.UserSession

fun getInventoryPage(
    session: UserSession?,
    locale: FoxyLocale,
    isProduction: Boolean,
    inventory: String,
): String {
    return buildUserInventory(
        session,
        locale,
        isProduction,
        "/${locale.language}/partials/inventory/$inventory",
    )
}