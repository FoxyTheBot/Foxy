package net.cakeyfox.foxy.website.frontend.pages

import kotlinx.html.*
import kotlinx.html.stream.createHTML
import net.cakeyfox.foxy.website.frontend.utils.buildHead
import net.cakeyfox.foxy.website.frontend.utils.getLanguage
import net.cakeyfox.foxy.website.frontend.utils.headerWithUser
import net.cakeyfox.serializable.data.website.UserSession

data class Perk(val description: String, val included: Boolean? = null)
data class PremiumItem(
    val name: String,
    val price: Double,
    val perks: List<Perk> = emptyList(),
    val monthly: Boolean = true,
    val itemId: String
)

private val premiumPlans = listOf(
    PremiumItem(
        "Plano Gratuito",
        0.0,
        listOf(
            Perk("Badge exclusíva no perfil", false),
            Perk("Livre de \"vote para desbloquear\"", false),
            Perk("Desconto nas decorações", false),
            Perk("Não paga taxas de inatividade", false),
            Perk("Não paga taxas de casamento", false),
            Perk("Acesso antecipado a novos recursos", false),
            Perk("Modo 24/7 para os recursos de música", false),
            Perk("Uso de filtros para músicas", false),
            Perk("Até 3 canais do YouTube em um servidor"),
            Perk("Até 100 músicas na lista de reprodução"),
            Perk("Multiplicador de daily 1x"),
            Perk("Limite de 8.000 Cakes no /daily")
        ),
        monthly = false,
        itemId = "#"
    ),
    PremiumItem(
        "Plano Básico",
        10.00,
        listOf(
            Perk("Badge exclusíva no perfil", true),
            Perk("Livre de \"vote para desbloquear\"", true),
            Perk("Desconto nas decorações", false),
            Perk("Não paga taxas de inatividade", false),
            Perk("Não paga taxas de casamento", true),
            Perk("Acesso antecipado a novos recursos", false),
            Perk("Modo 24/7 para os recursos de música", false),
            Perk("Uso de filtros para músicas", false),
            Perk("Até 5 canais do YouTube em um servidor"),
            Perk("Até 200 músicas na lista de reprodução"),
            Perk("Multiplicador de daily 1.25x"),
            Perk("Limite de 15.000 Cakes no /daily")
        ),
        itemId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    ),
    PremiumItem(
        "Plano Recomendado",
        20.00,
        listOf(
            Perk("Badge exclusíva no perfil", true),
            Perk("Livre de \"vote para desbloquear\"", true),
            Perk("Desconto nas decorações", false),
            Perk("Não paga taxas de inatividade", true),
            Perk("Não paga taxas de casamento", true),
            Perk("Acesso antecipado a novos recursos", true),
            Perk("Modo 24/7 para os recursos de música", true),
            Perk("Uso de filtros para músicas", false),
            Perk("Até 10 canais do YouTube em um servidor"),
            Perk("Até 300 músicas na lista de reprodução"),
            Perk("Multiplicador de daily 1.5x"),
            Perk("Limite de 20.000 Cakes no /daily")
        ),
        itemId = "a2b3c4d5-e6f7-8901-bcde-f23456789012"
    ),
    PremiumItem(
        "Plano Completo",
        30.00,
        listOf(
            Perk("Badge exclusíva no perfil", true),
            Perk("Livre de \"vote para desbloquear\"", true),
            Perk("Desconto nas decorações", true),
            Perk("Não paga taxas de inatividade", true),
            Perk("Não paga taxas de casamento", true),
            Perk("Acesso antecipado a novos recursos", true),
            Perk("Modo 24/7 para os recursos de música", true),
            Perk("Uso de filtros para músicas", true),
            Perk("Até 15 canais do YouTube em um servidor"),
            Perk("Até 500 músicas na lista de reprodução"),
            Perk("Multiplicador de daily 2x"),
            Perk("Limite de 25.000 Cakes no /daily")
        ),
        itemId = "a3b4c5d6-f7g8-9012-cdef-34567890123"
    )
)

private val cakePackages = listOf(
    PremiumItem("100.000 Cakes", 9.99, monthly = false, itemId = "6987dfff-ced0-40c5-913f-43395d3e6e90"),
    PremiumItem("300.000 Cakes", 19.99, monthly = false, itemId = "cf9a9137-c2c1-46d1-9b6b-6831db809380"),
    PremiumItem("1.000.000 Cakes", 49.99, monthly = false, itemId = "ddb6bff9-ccb6-40be-9dfa-a16a4e11dea4"),
    PremiumItem("2.000.000 Cakes", 99.99, monthly = false, itemId = "8068fd2e-a799-43e4-9b50-e7505cc9ab95")
)

fun premiumPage(user: UserSession?, lang: String): String = createHTML().html {
    val locale = getLanguage(lang)

    head {
        buildHead(
            titleText = "Premium",
            description = "Me ajude a ficar online comprando premium e melhore a sua experiência e a dos membros do seu servidor! :3",
            image = "images/foxy_wow.png"
        )
    }

    body {
        headerWithUser(user, locale)

        main {
            section("store-info") {
                h1("store-title") { +"Lojinha da Foxy" }
                img(classes = "store_image") {
                    src = "/assets/images/store.png"
                    alt = "Imagem da loja da Foxy"
                }

                p("store-description") {
                    +"Melhore sua experiência com os recursos premium da Foxy!"
                    br()
                    +"Desbloqueie recursos especiais para tornar seu servidor um lugar único!"
                    br()
                    +"Além de desbloquear recursos únicos, você ajuda a Foxy a continuar online e espalhando alegria e fofura pelo Discord!"
                }
            }

            section("items") {
                premiumPlans.forEach { plan -> addItem(plan) }
            }

            section("items") {
                cakePackages.forEach { pack -> addItem(pack) }
            }
        }

        script {
            src = "/js/HeaderMobile.js"
        }
    }
}

private fun FlowContent.addItem(item: PremiumItem) {
    div(classes = if (item.name.contains("Recomendado")) "item rec" else "item") {
        if (item.name.contains("Recomendado")) {
            div("recommended-flag") { +"Recomendado" }
        }

        div("item__info") {
            h2("plan-title") { +item.name }

            h3("price") {
                val text = when {
                    item.price == 0.0 -> "Grátis"
                    item.monthly -> "R$ ${item.price.toTwoDecimalString()}/mês"
                    else -> "R$ ${item.price.toTwoDecimalString()}"
                }
                +text
            }

            if (item.perks.isNotEmpty()) {
                ul("perks") {
                    item.perks.forEach { addPerk(it) }
                }
            }

            div("item__buttons") {
                a(classes = "item__button") {
                    href = if (item.price == 0.0) "#" else "/checkout?itemId=${item.itemId}"
                    b {
                        if (item.price == 0.0) +"Plano padrão"
                        else +"Quero esse!"
                    }
                }
            }
        }
    }
}

fun Double.toTwoDecimalString(): String {
    val rounded = kotlin.math.round(this * 100) / 100
    val parts = rounded.toString().split(".")
    val integerPart = parts[0]
    val decimalPart = parts.getOrElse(1) { "0" }.padEnd(2, '0')
    return "$integerPart.$decimalPart"
}

private fun UL.addPerk(perk: Perk) {
    li {
        when (perk.included) {
            true -> +"✅ ${perk.description}"
            false -> +"❌ ${perk.description}"
            null -> +perk.description
        }
    }
}