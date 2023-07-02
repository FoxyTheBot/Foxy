import { createCommand } from '../../structures/commands/createCommand';
import { masks } from '../../structures/json/layoutList.json'
import { createActionRow, createButton, createCustomId, createSelectMenu } from '../../utils/discord/Component';
import { MessageFlags } from '../../utils/discord/Message';
import { ButtonStyles } from 'discordeno/types';
import MaskSetExecutor from '../../utils/commands/executors/economy/MaskSetExecutor';
import { bot } from '../../index';
import { ApplicationCommandOptionTypes } from 'discordeno/types';

const choices = masks.map(data => Object({ name: data.name, nameLocalizations: data.nameLocalizations, value: data.id }));
const MaskCommand = createCommand({
    name: 'mask',
    description: '[Economy] Change your profile mask',
    descriptionLocalizations: {
        'pt-BR': '[Economia] Mude a máscara do seu perfil'
    },
    category: 'economy',
    options: [
        {
            name: "set",
            nameLocalizations: {
                "pt-BR": "definir"
            },
            description: "[Economy] Set your profile mask",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Defina a máscara do seu perfil"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        },
        {
            name: "buy",
            nameLocalizations: {
                "pt-BR": "comprar"
            },
            description: "[Economy] Buy a mask",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Compre uma máscara"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "mask",
                    description: "Select the mask you want to buy",
                    descriptionLocalizations: {
                        "pt-BR": "Selecione a máscara que deseja comprar"
                    },
                    type: ApplicationCommandOptionTypes.String,
                    required: true,
                    choices: choices
                }
            ]
        }
    ],
    commandRelatedExecutions: [MaskSetExecutor],
    execute: async (context, endCommand, t) => {
        const subCommand = context.getSubCommand();
        const userData = await bot.database.getUser(context.author.id);
        switch (subCommand) {
            case "set": {
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
                            customId: createCustomId(0, context.author.id, context.commandId, subCommand),
                            placeholder: t('commands:masks.selectMask'),
                            options: userMasks.map(data => Object({ label: data, value: data }))
                        })])],
                        flags: MessageFlags.EPHEMERAL
                    });
                }
            }
        }
    }
});

export default MaskCommand;