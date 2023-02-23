import ComponentInteractionContext from "../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../index";
import { createActionRow, createCustomId, createButton, createSelectMenu } from "../../../utils/discord/Component";
import { MessageFlags } from '../../../utils/discord/Message';
import { ButtonStyles } from "discordeno/types";

const MaskExecutor = async (context: ComponentInteractionContext) => {
    const [code, mask, subCommand] = context.sentData;

    if (subCommand === 'buy') {
        const userData = await bot.database.getUser(context.author.id);
        
        if (userData.balance < mask) {
            context.sendReply({
                flags: MessageFlags.Ephemeral
            });
            context.followUp({
                content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:masks.buy.noMoney')),
                flags: MessageFlags.Ephemeral
            });
        } else {
             userData.balance -= Number(mask);
             userData.mask = code;
             userData.masks.push(code);
             await userData.save();
             context.sendReply({
                    content: bot.locale('commands:masks.buy.success'),
                    flags: MessageFlags.Ephemeral,
                    components: [createActionRow([createButton({
                        customId: createCustomId(0, context.author.id, context.commandId, code, mask, subCommand),
                        label: bot.locale('commands:masks.buy.purchase'),
                        style: ButtonStyles.Secondary,
                        emoji: {
                            name: bot.emotes.FOXY_DAILY
                        },
                        disabled: true
                    })])]
             });
        }
    } else if (subCommand === 'set' || code === 'set') {
        const choice = context.interaction.data.values[0];
        const userData = await bot.database.getUser(context.author.id);

        if (userData.masks.includes(choice)) {
            userData.mask = choice;
            userData.save();
            context.sendReply({
                content: bot.locale('commands:masks.set.success'),
                components: [createActionRow([createSelectMenu({
                    customId: createCustomId(0, context.author.id, context.commandId, subCommand),
                    options: [
                        {
                            label: "nothing",
                            value: "nothing",
                        }
                    ],
                    placeholder: bot.locale('commands:masks.set.changed'),
                    disabled: true,
                })])]
            });
        } else {
            context.sendReply({
                content: bot.locale('commands:masks.set.notOwned'),
                components: [createActionRow([createSelectMenu({
                    customId: createCustomId(0, context.author.id, context.commandId, subCommand),
                    options: [
                        {
                            label: "nothing",
                            value: "nothing",
                        }
                    ],
                    placeholder: bot.locale('commands:masks.set.changed'),
                    disabled: true,
                })])]
            })
        }
    }
}

export default MaskExecutor;