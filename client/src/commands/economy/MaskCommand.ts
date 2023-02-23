import { createCommand } from '../../structures/commands/createCommand';
import { masks } from '../../structures/json/layoutList.json'
import { createActionRow, createButton, createCustomId, createSelectMenu } from '../../utils/discord/Component';
import { MessageFlags } from '../../utils/discord/Message';
import { ButtonStyles } from 'discordeno/types';
import { bot } from '../../index';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import MaskExecutor from '../../utils/commands/executors/MaskExecutor';
import GenerateImage from '../../structures/GenerateImage';

const choices = masks.map(data => Object({ name: `${data.id} / ${data.price} Paws`, value: data.id }));
const MaskCommand = createCommand({
    name: 'mask',
    description: '[💵] Mude a máscara do seu perfil',
    descriptionLocalizations: {
        'en-US': '[💵] Change your profile mask'
    },
    category: 'economy',
    options: [
        {
            name: "set",
            nameLocalizations: {
                "pt-BR": "definir"
            },
            description: "[💵] Defina a máscara do seu perfil",
            descriptionLocalizations: {
                "en-US": "[💵] Set your profile mask"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        },
        {
            name: "buy",
            nameLocalizations: {
                "pt-BR": "comprar"
            },
            description: "[💵] Compre uma máscara",
            descriptionLocalizations: {
                "en-US": "[💵] Buy a mask"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "mask",
                    description: "Selecione a máscara que deseja comprar",
                    descriptionLocalizations: {
                        "en-US": "Select the mask you want to buy"
                    },
                    type: ApplicationCommandOptionTypes.String,
                    required: true,
                    choices: choices
                }
            ]
        }
    ],
    commandRelatedExecutions: [MaskExecutor],
    execute: async (context, endCommand, t) => {
        const subCommand = context.getSubCommand();
        const userData = await bot.database.getUser(context.author.id);
        switch(subCommand) {
            case "buy": {
                await context.defer(true);
                const code: string = context.getOption<string>("mask", false);
                const mask = masks.find(data => data.id === code?.toLowerCase());
                if(userData.masks.includes(code?.toLowerCase())) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:masks.alreadyOwned')),
                        flags: MessageFlags.Ephemeral
                    });

                    return endCommand();
                }    
            
                const canvasGenerator = new GenerateImage(t, context.author, userData, 1436, 884, true, code, true);
                const profile = await canvasGenerator.renderProfile();

                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:masks.preview')),
                    file: [{
                        name: 'profile.png',
                        blob: await profile
                    }],
                    flags: MessageFlags.Ephemeral,
                    components: [createActionRow([createButton({
                        customId: createCustomId(0, context.author.id, context.commandId, code, mask?.price, subCommand),
                        label: t('commands:masks.purchase'),
                        style: ButtonStyles.Success,
                        emoji: {
                            name: bot.emotes.FOXY_DAILY,
                        }
                    })])]
                });
                
                endCommand();
                break;
            };

            case "set": {
                const userMasks = userData.masks;
                if(userMasks.length === 0) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:masks.noMasks')),
                        flags: MessageFlags.Ephemeral
                    });

                    return endCommand();
                } else {
                    context.defer(true);
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:masks.selectMask')),
                        components: [createActionRow([createSelectMenu({
                            customId: createCustomId(0, context.author.id, context.commandId, subCommand),
                            placeholder: t('commands:masks.selectMask'),
                            options: userMasks.map(data => Object({ label: data, value: data }))
                        })])]
                    });
                }
            }
        }
    }
});

export default MaskCommand;