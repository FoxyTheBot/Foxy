package frontend.htmx.partials

import kotlinx.html.div
import kotlinx.html.h2
import kotlinx.html.h4
import kotlinx.html.stream.createHTML
import net.cakeyfox.common.FoxyLocale

fun renderPartnershipDashboard(
    locale: FoxyLocale
): String {
    return createHTML().div("cirno-card-container") {
        div("cirno-card-grid") {
            div("cirno-card grid") {
                div("cirno-card-info") {
                    h2("cirno-card-name big-name") {
                        +"Servidor Privado"
                    }

                    h4("cirno-card-details") {
                        +"Acesse o servidor exclusivo de parceiros da Foxy para conversar com outros parceiros e receber suporte direto da equipe."
                    }
                }
            }

            div("cirno-card grid") {
                div("cirno-card-info") {
                    h2("cirno-card-name big-name") {
                        +"Recompensas"
                    }

                    h4("cirno-card-details") {
                        +"Receba recompensas exclusivas e benefícios especiais para aumentar o engajamento do seu servidor."
                    }
                }
            }

            div("cirno-card grid") {
                div("cirno-card-info") {
                    h2("cirno-card-name big-name") {
                        +"Suporte"
                    }

                    h4("cirno-card-details") {
                        +"Conte com suporte prioritário da equipe da Foxy para resolver dúvidas ou problemas rapidamente."
                    }
                }
            }
        }

        div("cirno-card warning") {
            div("cirno-card-info") {
                h2("cirno-card-name big-name") {
                    +"Aviso"
                }

                h4("cirno-card-details") {
                    +"O painel de configuração foi removido, pois a funcionalidade de dar assinatura para as pessoas foi removida por não dar o resultado esperado."
                }
            }
        }
    }
}