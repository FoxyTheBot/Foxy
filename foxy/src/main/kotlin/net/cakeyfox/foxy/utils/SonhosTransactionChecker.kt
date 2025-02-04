package net.cakeyfox.foxy.utils

import kotlinx.coroutines.delay
import mu.KotlinLogging
import net.cakeyfox.common.Colors
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.serializable.loritta.SonhosRequestResponse

class SonhosTransactionChecker(
    private val response: SonhosRequestResponse,
    private val context: FoxyInteractionContext
) {
    private val logger = KotlinLogging.logger {}

    suspend fun execute() {
        val start = System.currentTimeMillis()
        logger.info { "Waiting for ${context.user.id} to accept the transaction on Loritta (ID: ${response.sonhosTransferRequestId})" }

        val timeout = 60 * 60 * 1000
        val interval = 30 * 1000
        var transactionAccepted = false

        while (System.currentTimeMillis() - start < timeout) {
            delay(interval.toLong())

            val sonhosCheck = context.foxy.utils.loritta.checkLorittaTransactionStatus(
                response.sonhosTransferRequestId!!.toLong()
            )
            logger.info { "Re-checking if user ${context.user.id} accepted the transaction on Loritta (ID: ${response.sonhosTransferRequestId})" }

            if (sonhosCheck != null) {
                if (sonhosCheck.giverAcceptedAt != null) {
                    logger.info { "User ${context.user.id} accepted the transaction on Loritta (ID: ${response.sonhosTransferRequestId})" }
                    context.reply {
                        embed {
                            title = pretty(
                                FoxyEmotes.FoxyYay,
                                context.locale["cakes.convert.successConfirmed.title"]
                            )
                            description = pretty(
                                FoxyEmotes.FoxyYay,
                                context.locale["cakes.convert.successConfirmed.loritta_to_foxy", response.quantityAfterTax!!.toString()]
                            )
                            color = Colors.GREEN

                            footer {
                                name = "ID da transação: #${response.sonhosTransferRequestId}"
                            }
                        }
                    }

                    context.foxy.mongoClient.utils.user.updateUser(
                        context.user.id,
                        mapOf(
                            "userCakes.balance" to context.getAuthorData().userCakes.balance + sonhosCheck.quantityAfterTax!!
                        )
                    )
                    transactionAccepted = true
                    break
                } else {
                    logger.info { "User ${context.user.id} didn't accept the transaction on Loritta yet (ID: ${response.sonhosTransferRequestId})" }
                }
            }
        }

        if (!transactionAccepted) {
            logger.info { "Transaction timeout reached for user ${context.user.id} (ID: ${response.sonhosTransferRequestId})" }
            context.reply {
                embed {
                    title = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale["cakes.convert.failed.title"]
                    )
                    description = pretty(
                        FoxyEmotes.FoxyCry,
                        context.locale["cakes.convert.failed.timeout", response.quantityAfterTax!!.toString()]
                    )
                    color = Colors.RED

                    footer {
                        name = "ID da transação: #${response.sonhosTransferRequestId}"
                    }
                }
            }
        }

        logger.info { "Finished checking if user ${context.user.id} accepted the transaction on Loritta (ID: ${response.sonhosTransferRequestId})" }
    }
}
