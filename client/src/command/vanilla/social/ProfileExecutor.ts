import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { bot } from '../../../index';
import { User } from 'discordeno/transformers';
import CreateProfile from '../../../utils/images/generators/GenerateProfile';

export default async function ProfileExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const subcommand = context.getSubCommand();

    switch (subcommand) {
        case 'view': {
            const user = context.getOption<User>('user', 'users') ?? context.author;
            const userData = await bot.database.getUser(user.id);

            if (userData.isBanned) {
                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_RAGE, t('commands:profile.banned', { user: await bot.foxyRest.getUserDisplayName(user.id), reason: userData.banReason, date: userData.banData.toLocaleString(global.t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }))
                });
                return endCommand();
            }

            await context.sendDefer();
            const createProfile = new CreateProfile(t, user, userData);
            const profile = createProfile.create();

            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:profile.profile', { user: `<@${user.id}>` })),
                file: [{ name: 'profile.png', blob: await profile }]
            })
            return endCommand();
        }
    }
}