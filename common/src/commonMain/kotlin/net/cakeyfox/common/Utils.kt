package net.cakeyfox.common

fun checkUserPermissions(permissions: Long): Boolean {
    return permissions and 0x8 != 0L
}