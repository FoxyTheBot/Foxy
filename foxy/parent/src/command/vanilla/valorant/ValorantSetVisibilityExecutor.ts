import { MessageFlags } from "../../../utils/discord/Message";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function ValorantSetVisibilityExecutor(bot, context: UnleashedCommandExecutor, endCommand, t) {
    const visibility = context.getOption<string>('visibility', false);
    const valUserInfo = await bot.database.getUser(context.author.id);

    if (valUserInfo.riotAccount.isLinked) {
        valUserInfo.riotAccount.isPrivate = visibility;
        await valUserInfo.save();

        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:valorant.visibilityChanged', { visibility: visibility === 'true' ? t('commands:valorant.private') : t('commands:valorant.public') })),
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }
}