import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { MessageFlags } from "../../../utils/discord/Message";
import { bot } from "../../../FoxyLauncher";
import { lylist } from '../../../structures/json/layoutList.json';

export default async function LayoutExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const selectedOption = context.getOption<string>('layout', false, true);
    const layouts = lylist.map(data => data.id);
    if (!layouts.includes(selectedOption)) return context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:layouts.notFound')),
        flags: MessageFlags.EPHEMERAL
    });
    const userData = await bot.database.getUser(context.author.id);
    userData.userProfile.layout = selectedOption;
    await userData.save();
    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:layouts.changed')),
        flags: MessageFlags.EPHEMERAL
    })
    endCommand();
}