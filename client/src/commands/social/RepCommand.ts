import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from 'discordeno/types'
import { User } from "discordeno/transformers";
import { bot } from "../../index";
import ms from "ms";

const RepCommand = createCommand({
name: "rep",
    description: "[Social] Dê reputação para um usuário",
    descriptionLocalizations: {
        "en-US": "[Social] Give reputation to a user"
    },
    category: "social",
    options: [
        {
            name: "user",
            nameLocalizations: { "pt-BR": "usuário" },
            description: "O usuário que você quer dar reputação",
            descriptionLocalizations: {
                "en-US": "The user you want to give reputation"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');
        if (!user) {
            context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'));
            return endCommand();
        }

        if (user.id === context.author.id) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:rep.self'))
            })
            return endCommand();
        }

        const userData = await bot.database.getUser(user.id);
        const authorData = await bot.database.getUser(context.author.id);
        const repCooldown = 3600000;

        if (repCooldown - (Date.now() - authorData.lastRep) > 0) {
            const currentCooldown = ms(repCooldown - (Date.now() - authorData.lastRep));
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:rep.cooldown', { cooldown: currentCooldown }))
            })
            endCommand();
        } else {
            userData.repCount++;
            authorData.lastRep = Date.now();
            authorData.save();
            userData.save();
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:rep.success', { user: user.username }))
            })
            endCommand();
        }
    }
});

export default RepCommand;