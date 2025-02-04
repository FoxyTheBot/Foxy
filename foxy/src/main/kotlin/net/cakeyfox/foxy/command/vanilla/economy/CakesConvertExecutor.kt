package net.cakeyfox.foxy.command.vanilla.economy

import dev.minn.jda.ktx.coroutines.await
import net.cakeyfox.common.Colors
import net.cakeyfox.common.Constants
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.command.structure.FoxyCommandExecutor
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.Permission
import net.dv8tion.jda.api.entities.channel.ChannelType

class CakesConvertExecutor : FoxyCommandExecutor() {
    override suspend fun execute(context: FoxyInteractionContext) {
        val from = context.getOption<String>("from") ?: return
        val amount = context.getOption<Long>("amount") ?: return

        val botSettings = context.foxy.mongoClient.utils.bot.getBotSettings()

        if (amount < 1_000) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["cakes.convert.minimumAmount"])
            }

            return
        }

        if (!botSettings.exchangeSettings.isExchangeEnabled) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["cakes.convert.exchangeDisabled"])
            }

            return
        }

        if (context.event.channelType == ChannelType.PRIVATE) {
            context.reply {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["cakes.convert.onlyInGuilds"])
            }

            return
        }

        if (context.guild?.selfMember == null) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry, context.locale[
                        "cakes.convert.botNotInGuild",
                        Constants.FOXY_WEBSITE
                    ]
                )
            }

            return
        }

        val isLorittaInGuild = try {
            context.guild.retrieveMemberById("297153970613387264").await()
        } catch (e: Exception) {
            null
        }

        if (isLorittaInGuild == null) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyCry, context.locale[
                        "cakes.convert.lorittaNotInGuild",
                        Constants.LORITTA_INVITE
                    ]
                )
            }

            return
        }

        if (!context.guild.selfMember.hasPermission(Permission.ADMINISTRATOR)) {
            context.reply(true) {
                content = pretty(FoxyEmotes.FoxyCry, context.locale["cakes.convert.botNeedsAdmin"])
            }

            return
        }

        when (from) {
            "loritta_to_foxy" -> {
                if (!botSettings.exchangeSettings.lorittaToFoxyExchange.isExchangeEnabled) {
                    context.reply(true) {
                        content = pretty(FoxyEmotes.FoxyCry, context.locale["cakes.convert.lorittaToFoxyDisabled"])
                    }

                    return
                } else convertSonhosToCakes(context)
            }

            "foxy_to_loritta" -> {
                if (!botSettings.exchangeSettings.foxyToLorittaExchange.isExchangeEnabled) {
                    context.reply(true) {
                        content = pretty(FoxyEmotes.FoxyCry, context.locale["cakes.convert.foxyToLorittaDisabled"])
                    }

                    return
                }
            }
        }
    }


    private suspend fun convertSonhosToCakes(context: FoxyInteractionContext) {
        val amount = context.getOption<Long>("amount") ?: return

        val response = context.foxy.utils.loritta.requestSonhosFromUser(context) {
            senderId = context.user.id
            quantity = amount
            reason = "Conversão de Sonhos para Cakes"
            expiresAfterMillis = 1 * 60 * 1000
        }
        context.reply {
            embed {
                title = context.locale["cakes.convert.success.title"]
                description = context.locale["cakes.convert.success.loritta_to_foxy", amount.toString()]
                color = Colors.ORANGE
                footer {
                    name = "ID da transação: #${response.sonhosTransferRequestId}"
                }
            }

            context.foxy.threadPoolManager.launchSonhosTransactionCheckJob(
                response,
                context
            )
        }
    }
}