import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { createActionRow, createSelectMenu, createCustomId } from '../../../utils/discord/Component';
import { bglist } from "../../../structures/json/backgroundList.json"
import { bot } from '../../../index';
import { MessageFlags } from '../../../utils/discord/Message';

export default async function ChangeExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const subCommand = context.getSubCommand();
        const userData = await bot.database.getUser(context.author.id);

        switch (subCommand) {
            case 'background': {
                await context.sendDefer(true);
                const fetchBackgrounds = userData.backgrounds;
                const backgrounds = await bglist.filter((b) => fetchBackgrounds.includes(b.id));

                context.sendReply({
                    components: [createActionRow([createSelectMenu({
                        customId: createCustomId(0, context.author.id, context.commandId, subCommand),
                        placeholder: t('commands:background.set.title'),
                        options: backgrounds.map((b) => Object({
                            label: b.name,
                            value: b.id,
                        }))
                    })])],
                    flags: MessageFlags.EPHEMERAL
                });
                endCommand();
                break;
            }

            case 'avatar_decoration': {
                const userMasks = userData.masks;
                if (userMasks.length === 0) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:masks.noMasks')),
                        flags: MessageFlags.EPHEMERAL
                    });

                    return endCommand();
                } else {
                    context.sendDefer(true);
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:masks.selectMask')),
                        components: [createActionRow([createSelectMenu({
                            customId: createCustomId(1, context.author.id, context.commandId, subCommand),
                            placeholder: t('commands:masks.selectMask'),
                            options: userMasks.map(data => Object({ label: t(`commands:masks.list.${data}`), value: data }))
                        })])],
                        flags: MessageFlags.EPHEMERAL
                    });
                }
                break;
            }
        }
}