import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";
import { MessageFlags } from "../../../../utils/discord/Message";
import { ButtonStyles } from "discordeno/types";
import { bglist } from '../../../../structures/json/backgroundList.json';

const BackgroundExecutor = async (context: ComponentInteractionContext) => {
    const [code, background, subcommand] = context.sentData;
    const userData = await bot.database.getUser(context.author.id);
    const clientData = await bot.database.getUser(bot.id);

    if (userData.userCakes.balance < Number(background)) {
        context.followUp({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:background.buy.noMoney')),
            flags: MessageFlags.EPHEMERAL
        });
    } else {
        // const backgroundInfo = await bglist.find((b) => b.id === code?.toLowerCase())

        // if (backgroundInfo.author) {
        //     const bgAuthorMoney = backgroundInfo.cakes * 0.9;
        //     const bgAuthor = await bot.database.getUser(backgroundInfo.author);
        //     const clientMoney = backgroundInfo.cakes * 0.1;

        //     clientData.balance += clientMoney;
        //     bgAuthor.balance += bgAuthorMoney;
        //     userData.userProfile.backgroundList.push(code);
        //     userData.userProfile.background = code;
        //     await userData.save();
        //     await clientData.save();
        //     await bgAuthor.save();

        //     return await context.sendReply({
        //         flags: MessageFlags.EPHEMERAL,
        //         content: context.makeReply(bot.emotes.FOXY_YAY, bot.locale('commands:background.buy.success')),
        //         embeds: null,
        //         components: [createActionRow([createButton({
        //             customId: createCustomId(0, context.author.id, context.commandId, code, background, subcommand),
        //             label: bot.locale('commands:background.buy.purchased'),
        //             style: ButtonStyles.Secondary,
        //             emoji: {
        //                 id: bot.emotes.FOXY_DAILY
        //             },
        //             disabled: true
        //         })])]
        //     })
        // }

        userData.userCakes.balance -= Number(background);
        clientData.userCakes.balance += Number(background);
        userData.userProfile.backgroundList.push(code);
        userData.userProfile.background = code;
        userData.userTransactions.push({
            to: String(bot.id),
            from: String(context.author.id),
            quantity: Number(background),
            date: new Date(Date.now()),
            received: false,
            type: 'store'
        });
        await userData.save();
        await clientData.save();

        return await context.sendReply({
            flags: MessageFlags.EPHEMERAL,
            content: context.makeReply(bot.emotes.FOXY_YAY, bot.locale('commands:background.buy.success')),
            embeds: null,
            components: [createActionRow([createButton({
                customId: createCustomId(0, context.author.id, context.commandId, code, background, subcommand),
                label: bot.locale('commands:background.buy.purchased'),
                style: ButtonStyles.Secondary,
                emoji: {
                    id: bot.emotes.FOXY_DAILY
                },
                disabled: true
            })])]
        })

    }
}

export default BackgroundExecutor;