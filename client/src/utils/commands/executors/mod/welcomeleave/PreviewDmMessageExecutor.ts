import { bot } from "../../../../..";
import ComponentInteractionContext from "../../../../../structures/commands/ComponentInteractionContext";
import { MessageFlags } from "../../../../discord/Message";
import { InteractionCallbackData } from "discordeno/types";

const PreviewDmMessageExecutor = async (context: ComponentInteractionContext) => {
    const guildInfo = await bot.database.getGuild(context.interaction.guildId);

    if (guildInfo.WelcomeModule.isEnabled && guildInfo.WelcomeModule.sendDm && guildInfo.WelcomeModule.dmMessage) {
        const message: InteractionCallbackData = guildInfo.WelcomeModule.dmMessage;
        message.flags = MessageFlags.EPHEMERAL;

        context.followUp(message);
    }

    else {
        await context.followUp({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale("commands:WelcomeLeave.texts.noMessage")),
            flags: MessageFlags.EPHEMERAL
        });
    }
}

export default PreviewDmMessageExecutor;