package net.cakeyfox.foxy.command.component

import com.github.benmanes.caffeine.cache.Caffeine
import net.cakeyfox.common.FoxyEmotes
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.command.FoxyInteractionContext
import net.cakeyfox.foxy.utils.pretty
import net.dv8tion.jda.api.entities.User
import net.dv8tion.jda.api.entities.emoji.Emoji
import net.dv8tion.jda.api.interactions.components.LayoutComponent
import net.dv8tion.jda.api.interactions.components.buttons.Button
import net.dv8tion.jda.api.interactions.components.buttons.ButtonStyle
import net.dv8tion.jda.api.interactions.components.selections.StringSelectMenu
import net.dv8tion.jda.api.interactions.modals.Modal
import java.util.UUID
import kotlin.time.Duration.Companion.minutes
import kotlin.time.toJavaDuration

class FoxyComponentManager(
    val instance: FoxyInstance
) {
    companion object {
        val delay = 15.minutes
    }

    val componentCallbacks = Caffeine
        .newBuilder()
        .expireAfterWrite(delay.toJavaDuration())
        .build<UUID, suspend (FoxyInteractionContext) -> Unit>()
        .asMap()

    val stringSelectMenuCallbacks = Caffeine
        .newBuilder()
        .expireAfterWrite(delay.toJavaDuration())
        .build<UUID, suspend (FoxyInteractionContext, List<String>) -> Unit>()
        .asMap()

    fun createButtonForUser(
        targetUser: User,
        style: ButtonStyle,
        emoji: String? = null,
        label: String = "",
        builder: (ButtonBuilder).() -> (Unit) = {},
        callback: suspend (FoxyInteractionContext) -> (Unit)
    ) = createButton(targetUser.idLong, style, emoji, label, builder, callback)

    fun createLinkButton(
        emoji: Emoji? = null,
        label: String = "",
        url: String,
        builder: (ButtonBuilder).() -> (Unit) = {},
    ) = linkButton(
        emoji,
        label,
        url,
        builder
    )

    fun createButton(
        targetUserId: Long,
        style: ButtonStyle,
        emoji: String? = null,
        label: String = "",
        builder: (ButtonBuilder).() -> (Unit) = {},
        callback: suspend (FoxyInteractionContext) -> (Unit)
    ) = button(
        style,
        emoji,
        label,
        builder
    ) {
        if (targetUserId != it.user.idLong) {
            it.reply(true) {
                content = it.prettyResponse {
                    emoteId = FoxyEmotes.FoxyRage
                    content = it.locale["commands.onlyUserCanInteractWithThisComponent", "<@${targetUserId}>"]
                }
            }

            return@button
        }

        callback.invoke(it)
    }

    fun linkButton(
        emoji: Emoji? = null,
        label: String = "",
        url: String,
        builder: (ButtonBuilder).() -> (Unit) = {},
    ): Button {
        return Button.of(
            ButtonStyle.LINK,
            url,
            label,
            emoji
        ).let {
            ButtonBuilder(it).apply(builder).button
        }
    }

    fun button(
        style: ButtonStyle,
        emoji: String? = null,
        label: String = "",
        builder: (ButtonBuilder).() -> (Unit) = {},
        callback: suspend (FoxyInteractionContext) -> (Unit)
    ): Button {
        val buttonId = UUID.randomUUID()
        componentCallbacks[buttonId] = callback
        return Button.of(
            style,
            ComponentId(buttonId).toString(),
            label,
            emoji?.let { instance.jda.getEmojiById(it) }
        ).let {
            ButtonBuilder(it).apply(builder).button
        }
    }

    fun createModal(
        title: String,
        builder: (ModalBuilder).() -> (Unit) = {},
        callback: suspend (FoxyInteractionContext) -> (Unit)
    ) = modal(
        title,
        builder,
    ) {
        callback.invoke(it)
    }

    fun stringSelectMenuForUser(
        target: User,
        builder: (StringSelectMenu.Builder).() -> (Unit) = {},
        callback: suspend (FoxyInteractionContext, List<String>) -> (Unit)
    ) = stringSelectMenu(
        builder
    ) { context, strings ->
        if (target.idLong != context.user.idLong) {
            context.reply(true) {
                content = pretty(
                    FoxyEmotes.FoxyRage,
                    context.locale["commands.onlyUserCanInteractWithThisComponent", target.asMention, target.id]
                )
            }
            return@stringSelectMenu
        }

        callback.invoke(context, strings)
    }

    fun stringSelectMenu(
        builder: (StringSelectMenu.Builder).() -> (Unit) = {},
        callback: suspend (FoxyInteractionContext, List<String>) -> (Unit)
    ): StringSelectMenu {
        val selectMenuId = UUID.randomUUID()
        stringSelectMenuCallbacks[selectMenuId] = callback
        return StringSelectMenu.create(ComponentId(selectMenuId).toString())
            .apply(builder)
            .build()
    }

    fun modal(
        title: String,
        builder: (ModalBuilder).() -> (Unit) = {},
        callback: suspend (FoxyInteractionContext) -> (Unit)
    ): Modal {
        val modalId = UUID.randomUUID()
        componentCallbacks[modalId] = callback

        return Modal.create(
            ComponentId(modalId).toString(),
            title
        ).let {
            ModalBuilder(it).apply(builder).modal.build()
        }
    }

    class ModalBuilder(internal var modal: Modal.Builder) {
        @get:JvmSynthetic
        var title: String
            @Deprecated("", level = DeprecationLevel.ERROR)
            get() = throw UnsupportedOperationException()
            set(value) {
                modal = modal.setTitle(value)
            }

        @get:JvmSynthetic
        var components: List<LayoutComponent>
            @Deprecated("", level = DeprecationLevel.ERROR)
            get() = throw UnsupportedOperationException()
            set(value) {
                modal.addComponents(value)
            }
    }

    class ButtonBuilder(internal var button: Button) {

        @get:JvmSynthetic
        var emoji: Emoji
            @Deprecated("", level = DeprecationLevel.ERROR)
            get() = throw UnsupportedOperationException()
            set(value) {
                button = button.withEmoji(value)
            }

        var disabled
            get() = button.isDisabled
            set(value) {
                this.button = button.withDisabled(value)
            }
    }
}