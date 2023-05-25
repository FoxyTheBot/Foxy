import { bot } from "../../../../..";
import ComponentInteractionContext from "../../../../../structures/commands/ComponentInteractionContext";
import { MessageFlags } from "../../../../discord/Message";

const EnableDisableExecutor = async (context: ComponentInteractionContext) => {
    const guildInfo = await bot.database.getGuild(context.interaction.guildId);
    if (guildInfo.WelcomeModule.isEnabled) {
        guildInfo.WelcomeModule.isEnabled = false;
        
        await context.followUp({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale("commands:WelcomeLeave.texts.moduleDisabled")),
            flags: MessageFlags.EPHEMERAL
        })
    } else {
        guildInfo.WelcomeModule.isEnabled = true;

        await context.followUp({
            content: context.makeReply(bot.emotes.FOXY_YAY, bot.locale("commands:WelcomeLeave.texts.moduleEnabled")),
            flags: MessageFlags.EPHEMERAL
        })
    }
}

export default EnableDisableExecutor;