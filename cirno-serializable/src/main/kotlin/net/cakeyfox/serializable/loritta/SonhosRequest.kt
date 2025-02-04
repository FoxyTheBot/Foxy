package net.cakeyfox.serializable.loritta

import kotlinx.serialization.Serializable

@Serializable
data class SonhosRequestBody(
    var senderId: String = "0",
    var quantity: Long = 0,
    var reason: String = "",
    var expiresAfterMillis: Long? = null,
)

@Serializable
data class SonhosSendRequestBody(
    var receiverId: String = "0",
    var quantity: Long = 0,
    var reason: String = "",
    var expiresAfterMillis: Long? = null,
)

@Serializable
data class SonhosRequestResponse(
    val sonhosTransferRequestId: String? = null,
    val messageId: String? = null,
    val quantity: Long? = null,
    val quantityAfterTax: Long? = null,
    val tax: Long? = null,
    val taxPercentage: Double? = null,
)

@Serializable
data class SonhosTransferStatus(
    val giverId: String,
    val giverAcceptedAt: String? = null,
    val receiverId: String,
    val receiverAcceptedAt: String? = null,
    val quantity: Long,
    val quantityAfterTax: Long? = null,
    val tax: Long? = null,
    val taxPercentage: Double? = null,
    val requestedAt: String,
    val expiresAt: String? = null,
    val transferredAt: String? = null,
)