package frontend.pages.dashboard

import io.ktor.utils.io.ExperimentalKtorApi
import net.cakeyfox.common.FoxyLocale
import frontend.utils.buildDashboardModule
import net.cakeyfox.foxy.database.data.guild.Guild
import net.cakeyfox.serializable.data.website.DiscordServer
import net.cakeyfox.serializable.data.website.UserSession

@OptIn(ExperimentalKtorApi::class)
fun getModuleConfig(
    session: UserSession?,
    moduleId: String,
    guild: Guild,
    isFoxyverseGuild: Boolean,
    locale: FoxyLocale,
    isProduction: Boolean,
    availableGuilds: List<DiscordServer>
): String {
    return buildDashboardModule(
        session,
        titleText = locale["dashboard.modules.manage", locale["dashboard.modules.$moduleId.title"]],
        moduleTitle = locale["dashboard.modules.$moduleId.title"],
        moduleDescription = locale["dashboard.modules.$moduleId.description"],
        currentGuild = guild,
        locale = locale,
        isProduction = isProduction,
        isFoxyverseGuild = isFoxyverseGuild,
        partialUrl = "/${locale.language}/partials/${guild._id}/$moduleId",
        availableGuilds,
        moduleId
    )
}