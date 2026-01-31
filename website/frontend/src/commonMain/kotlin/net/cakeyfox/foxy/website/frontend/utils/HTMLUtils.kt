package net.cakeyfox.foxy.website.frontend.utils

import kotlinx.html.*
import net.cakeyfox.common.FoxyLocale

fun getLanguage(lang: String): FoxyLocale {
    return FoxyLocale(lang)
}

fun FlowContent.buildAd(isVertical: Boolean, isProduction: Boolean) {
    div {
        classes = if (isVertical) {
            setOf("ad vertical")
        } else setOf("ad horizontal")

        if (!isProduction) {
            if (isVertical) {
                img { src = "/assets/images/placeholders/vertical-ad.png" }
            } else img { src = "/assets/images/placeholders/horizontal-ad.png" }
        } else {
            script {
                async = true
                src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7726590371480649"
                crossorigin = ScriptCrossorigin.anonymous
            }

            ins {
                classes = setOf("adsbygoogle")
                if (isVertical) {
                    style = "display:inline-block;width:160px;height:600px"
                } else {
                    style = "display:inline-block;width:600px;height:200px"
                }

                attributes["data-ad-client"] = "ca-pub-7726590371480649"
                attributes["data-ad-slot"] = "4619028248"
            }

            script {
                unsafe {
                    +"""
            (adsbygoogle = window.adsbygoogle || []).push({});
            """.trimIndent()
                }
            }
        }
    }
}

fun HEAD.buildHead(
    titleText: String? = "Foxy",
    description: String? = "💫 Um bot multiuso para o seu servidor do Discord!",
    url: String? = "https://foxybot.xyz",
    image: String? = "images/FoxyAvatar.png",
    themeColor: String = "#e7385d",
    isDashboard: Boolean = false
) {
    meta(charset = "UTF-8")
    meta(name = "viewport", content = "width=device-width, initial-scale=1.0")
    link(rel = "canonical", href = url)
    link(rel = "icon", href = "/assets/images/foxycake.png")
    script(src = "https://unpkg.com/htmx.org@1.9.10") {}
    script(src = "https://unpkg.com/hyperscript.org@0.9.12") { defer = true }

    if (isDashboard) {
        // Dashboard pages doesn't have footer or header
        link(rel = "stylesheet", href = "/dashboard/assets/css/style.css") {
            attributes["type"] = "text/css"
        }

        link(rel = "stylesheet", href = "/v1/assets/css/global.css") {
            attributes["type"] = "text/css"
        }

        script(src = "/js/flandre-js.js") { defer = true }
        script(src = "/dashboard/js/dashboard-js.js") { defer = true }
    } else {
        script(src = "/js/flandre-js.js") { defer = true }

        link(rel = "stylesheet", href = "/v1/assets/css/global.css") {
            attributes["type"] = "text/css"
        }

        link(rel = "stylesheet", href = "/v1/assets/css/style.css") {
            attributes["type"] = "text/css"
        }
    }

    metaProperty("og:type", "website")
    metaProperty("og:title", titleText!!)
    metaProperty("og:site_name", "Foxy")
    metaProperty("og:description", description!!)
    metaProperty("og:url", url!!)
    metaProperty("og:image", "/assets/$image")
    metaName("theme-color", themeColor, mapOf("data-react-helmet" to "true"))

    title { +titleText }

    script {
        unsafe {
            +"""
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());
                gtag('config', 'G-E3J7N4BP8L');
            """.trimIndent()
        }
    }
}

fun HEAD.metaProperty(property: String, content: String) {
    meta {
        attributes["property"] = property
        this.content = content
    }
}

fun HEAD.metaName(name: String, content: String, extraAttrs: Map<String, String> = emptyMap()) {
    meta {
        attributes["name"] = name
        this.content = content
        extraAttrs.forEach { (k, v) -> attributes[k] = v }
    }
}

fun FlowContent.footerSection() {
    footer {
        div {
            div(classes = "social-networks") {
                a(href = "https://steamcommunity.com/groups/foxylambda") {
                    target = ATarget.blank
                    unsafe {
                        raw(
                            """
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="icon icon-steam">
                             <path d="M18.102 12.129c0-0 0-0 0-0.001 0-1.564 1.268-2.831 2.831-2.831s2.831 1.268 2.831 2.831c0 1.564-1.267 2.831-2.831 2.831-0 0-0 0-0.001 0h0c-0 0-0 0-0.001 0-1.563 0-2.83-1.267-2.83-2.83 0-0 0-0 0-0.001v0zM24.691 12.135c0-2.081-1.687-3.768-3.768-3.768s-3.768 1.687-3.768 3.768c0 2.081 1.687 3.768 3.768 3.768v0c2.080-0.003 3.765-1.688 3.768-3.767v-0zM10.427 23.76l-1.841-0.762c0.524 1.078 1.611 1.808 2.868 1.808 1.317 0 2.448-0.801 2.93-1.943l0.008-0.021c0.155-0.362 0.246-0.784 0.246-1.226 0-1.757-1.424-3.181-3.181-3.181-0.405 0-0.792 0.076-1.148 0.213l0.022-0.007 1.903 0.787c0.852 0.364 1.439 1.196 1.439 2.164 0 1.296-1.051 2.347-2.347 2.347-0.324 0-0.632-0.066-0.913-0.184l0.015 0.006zM15.974 1.004c-7.857 0.001-14.301 6.046-14.938 13.738l-0.004 0.054 8.038 3.322c0.668-0.462 1.495-0.737 2.387-0.737 0.001 0 0.002 0 0.002 0h-0c0.079 0 0.156 0.005 0.235 0.008l3.575-5.176v-0.074c0.003-3.12 2.533-5.648 5.653-5.648 3.122 0 5.653 2.531 5.653 5.653s-2.531 5.653-5.653 5.653h-0.131l-5.094 3.638c0 0.065 0.005 0.131 0.005 0.199 0 0.001 0 0.002 0 0.003 0 2.342-1.899 4.241-4.241 4.241-2.047 0-3.756-1.451-4.153-3.38l-0.005-0.027-5.755-2.383c1.841 6.345 7.601 10.905 14.425 10.905 8.281 0 14.994-6.713 14.994-14.994s-6.713-14.994-14.994-14.994c-0 0-0.001 0-0.001 0h0z"/>
                        </svg>
                        """.trimIndent()
                        )
                    }
                }

                a(href = "https://twitter.com/FoxyTheBot") {
                    target = ATarget.blank
                    unsafe {
                        raw(
                            """
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon icon-twitter">
                          <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                        </svg>
                        """.trimIndent()
                        )
                    }
                }
                a(href = "https://instagram.com/foxythebot") {
                    target = ATarget.blank
                    unsafe {
                        raw(
                            """
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon icon-instagram">
                          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                        </svg>
                        """.trimIndent()
                        )
                    }
                }
                a(href = "https://youtube.com/@foxythebot") {
                    target = ATarget.blank
                    unsafe {
                        raw(
                            """
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="icon icon-youtube">
                          <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
                        </svg>
                        """.trimIndent()
                        )
                    }
                }
                a(href = "https://www.tiktok.com/@foxydiscordbot") {
                    target = ATarget.blank
                    unsafe {
                        raw(
                            """
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon icon-tiktok">
                          <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path>
                        </svg>
                        """.trimIndent()
                        )
                    }
                }
                a(href = "https://github.com/FoxyTheBot") {
                    target = ATarget.blank
                    unsafe {
                        raw(
                            """
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" class="icon icon-github">
                          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                        </svg>
                        """.trimIndent()
                        )
                    }
                }
                a(href = "https://discord.gg/6mG2xDtuZD") {
                    target = ATarget.blank
                    unsafe {
                        raw(
                            """
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="icon icon-discord">
                          <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path>
                        </svg>
                        """.trimIndent()
                        )
                    }
                }
            }
            nav(classes = "navigation-footer") {
                p(classes = "footer-paragraph") {
                    style = "text-align: center;"
                    +"© WinG4merBR & CakeyFox\n        2020-2026 — Todos os direitos reservados"
                }
            }
        }
    }
}