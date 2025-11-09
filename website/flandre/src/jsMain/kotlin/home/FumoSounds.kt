package home

import kotlinx.browser.document
import org.w3c.dom.Audio
import org.w3c.dom.HTMLImageElement

object SoundUtils {
    fun playFumoSounds() {
        val foxyFumo = document.getElementById("foxy-fumo") as? HTMLImageElement

        val audios = arrayOf(
            "/assets/sfx/fumo.wav",
            "/assets/sfx/waa.wav",
            "/assets/sfx/foxy.wav"
        )

        foxyFumo?.addEventListener("click", {
            val randomAudio = audios.random()
            val audio = Audio(randomAudio)

            audio.play()
        })
    }

}