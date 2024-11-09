import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { MessageFlags } from "../../../../utils/discord/Message";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";

const DivorceButtonExecutor = async (context: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(context.user.id);
    const partnerId = await userData.marryStatus.marriedWith;

    if (!partnerId) {
        context.reply({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale("commands:divorce.notMarried")),
            flags: MessageFlags.EPHEMERAL
        });
        return;
    }

    const partnerData = await bot.database.getUser(BigInt(partnerId));
    const userInfo = await bot.users.get(BigInt(userData.marryStatus.marriedWith))
        ?? bot.helpers.getUser(BigInt(userData.marryStatus.marriedWith));

    userData.marryStatus.marriedWith = null;
    userData.marryStatus.marriedDate = null;
    partnerData.marryStatus.marriedWith = null;
    partnerData.marryStatus.marriedDate = null;
    await userData.save();
    await partnerData.save();

    context.reply({
        content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale("commands:divorce.divorced", { user: await bot.rest.foxy.getUserDisplayName((await userInfo).id) })),
        components: [createActionRow([createButton({
            customId: createCustomId(0, context.user.id, context.commandId),
            label: bot.locale("commands:divorce.confirmed"),
            style: ButtonStyles.Danger,
            emoji: {
                id: BigInt(bot.emotes.FOXY_CRY)
            },
            disabled: true
        })])],

    })
}

export default DivorceButtonExecutor;