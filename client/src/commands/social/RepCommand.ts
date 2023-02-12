import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from 'discordeno/types'
import { User } from "discordeno/transformers";
import { bot } from "../../index";
import ms from "ms";

const RepCommand = createCommand({
name: "rep",
    description: "[👥] Dê reputação para um usuário",
    descriptionLocalizations: {
        "en-US": "[👥] Give reputation to a user"
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

    execute: async (ctx, endCommand, t) => {
        const user = ctx.getOption<User>('user', 'users');
        if (!user) {
            ctx.makeReply(bot.emotes.error, t('commands:global.noUser'));
            return endCommand();
        }

        if (user.id === ctx.author.id) {
            ctx.foxyReply({
                content: ctx.makeReply("🚫", t('commands:rep.self'))
            })
            return endCommand();
        }

        const userData = await bot.database.getUser(user.id);
        const authorData = await bot.database.getUser(ctx.author.id);
        const repCooldown = 3600000;

        if (repCooldown - (Date.now() - authorData.lastRep) > 0) {
            const currentCooldown = ms(repCooldown - (Date.now() - authorData.lastRep));
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.error, t('commands:rep.cooldown', { cooldown: currentCooldown }))
            })
            endCommand();
        } else {
            userData.repCount++;
            authorData.lastRep = Date.now();
            authorData.save();
            userData.save();
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.success, t('commands:rep.success', { user: user.username }))
            })
            endCommand();
        }
    }
});

export default RepCommand;