import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";

const BetButtonExecutor = async (context: ComponentInteractionContext) => {
    const [targetUsername, targetId, amount, choice, buttonType] = context.sentData;
    const avaliableChoices = ['heads', 'tails'];
    const userData = await bot.database.getUser(context.author.id);
    const mentionData = await bot.database.getUser(BigInt(targetId));
    var rand = Math.floor(Math.random() * avaliableChoices.length);

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_WOW, bot.locale('commands:bet.ask', { user: `<@!${targetId}>`, author: await bot.foxyRest.getUserDisplayName(context.author.id), amount: amount.toString() })),
        components: [createActionRow([createButton({
            label: bot.locale('commands:bet.accept'),
            style: ButtonStyles.Success,
            customId: createCustomId(0, targetId, context.commandId, targetUsername, targetId, amount, choice, "accept"),
            disabled: true,
            emoji: {
                id: bot.emotes.FOXY_WOW
            }
        }),
        createButton({
            label: bot.locale('commands:bet.deny'),
            style: ButtonStyles.Danger,
            customId: createCustomId(0, targetId, context.commandId, targetUsername, targetId, amount, choice, "deny"),
            emoji: {
                id: bot.emotes.FOXY_CRY
            },
            disabled: true
        })])]
    });

    if (buttonType === "deny") {
        return context.followUp({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:bet.denied'))
        })
    } else {
        if (await userData.balance < amount) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, bot.locale('commands:bet.not-enough', { amount: amount.toString(), user: await bot.foxyRest.getUserDisplayName(context.author.id) })),
                flags: 64

            });

            return;
        }

        if (await mentionData.balance < amount) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, bot.locale('commands:bet.not-enough-mention', { amount: amount.toString(), user: await bot.foxyRest.getUserDisplayName(targetId) })),
                flags: 64
            });

            return;
        }

        if (choice === avaliableChoices[rand]) {
            context.followUp({
                content: context.makeReply(bot.emotes.FOXY_YAY, bot.locale('commands:bet.win', { user: await bot.foxyRest.getUserDisplayName(targetId), author: await bot.foxyRest.getUserDisplayName(context.author.id), choice: bot.locale(`commands:bet.${avaliableChoices[rand]}`), amount: `${amount}` })),
            });

            userData.balance += Number(amount);
            mentionData.balance -= Number(amount);
            userData.save();
            mentionData.save();
        } else if (choice !== avaliableChoices[rand]) {
            context.followUp({
                content: context.makeReply(bot.emotes.FOXY_YAY, bot.locale('commands:bet.lose', { user: await bot.foxyRest.getUserDisplayName(targetId), author: await bot.foxyRest.getUserDisplayName(context.author.id), choice: bot.locale(`commands:bet.${avaliableChoices[rand]}`), amount: `${amount}` })),
            });

            userData.balance -= Number(amount);
            mentionData.balance += Number(amount);
            userData.save();
            mentionData.save();
        }
    }
}

export default BetButtonExecutor;