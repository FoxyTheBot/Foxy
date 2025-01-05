package net.cakeyfox.foxy.utils.profile

import net.cakeyfox.serializable.database.data.Layout

object ProfileUtils {
    fun formatAboutMe(aboutMe: String, layoutInfo: Layout): String {
        val aboutMeLimit = layoutInfo.profileSettings.aboutme.limit
        val breakLength = layoutInfo.profileSettings.aboutme.breakLength
        return if (aboutMe.length > aboutMeLimit) {
            aboutMe.chunked(breakLength).joinToString("\n")
        } else {
            aboutMe
        }
    }
}