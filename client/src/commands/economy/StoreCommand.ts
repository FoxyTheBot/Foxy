import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { bot } from "../../index";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { bglist } from "../../structures/json/backgroundList.json";
import { masks } from '../../structures/json/layoutList.json'
import CreateProfile from '../../utils/commands/generators/GenerateProfile';
import MaskBuyExecutor from '../../utils/commands/executors/economy/MaskBuyExecutor';
import BackgroundBuyExecutor from '../../utils/commands/executors/economy/BackgroundBuyExecutor';
import { MessageFlags } from "../../utils/discord/Message";

var choices = [];
const maskList = masks.map(data => Object({ name: data.name, nameLocalizations: data.nameLocalizations, value: data.id }));

for (var i = 0; i < bglist.length; i++) {
    if (bglist[i].cakes === 0) continue;
    choices.push({
        name: `💖 ${bglist[i].name} - ${bglist[i].cakes} Cakes`,
        value: bglist[i].id
    })
}


const StoreCommand = createCommand({
    name: 'store',
    description: '[Economy] Buy items from the store',
    descriptionLocalizations: {
        'pt-BR': '[Economia] Compre itens da loja'
    },
    category: 'economy',
    options: [{
        name: "buy",
        nameLocalizations: {
            "pt-BR": "comprar"
        },
        description: "[Economy] Buy an item from the store",
        descriptionLocalizations: {
            "pt-BR": "[Economia] Compre um item da loja"
        },
        type: ApplicationCommandOptionTypes.SubCommandGroup,
        options: [{
            name: "backgrounds",
            nameLocalizations: {
                "pt-BR": "backgrounds"
            },
            description: "[Economy] Buy a background for your profile",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Compre um background para seu perfil"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "background",
                description: "Select the background you want to buy",
                descriptionLocalizations: {
                    "pt-BR": "Selecione o background que deseja comprar"
                },
                type: ApplicationCommandOptionTypes.String,
                required: true,
                choices: choices
            }]
        },
        {
            name: "masks",
            nameLocalizations: {
                "pt-BR": "máscaras"
            },
            description: "[Economy] Buy a mask for your profile avatar",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Compre uma máscara para o avatar do seu perfil"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "mask",
                description: "Select the mask you want to buy",
                descriptionLocalizations: {
                    "pt-BR": "Selecione a máscara que deseja comprar"
                },
                type: ApplicationCommandOptionTypes.String,
                required: true,
                choices: maskList
            }]
        }]
    }],
    commandRelatedExecutions: [
        BackgroundBuyExecutor, // 0
        MaskBuyExecutor, // 1
    ],

    execute: async (context, endCommand, t) => {
        const subCommand = context.getSubCommand();
        const userData = await bot.database.getUser(context.author.id);

        switch (subCommand) {
            case "backgrounds": {
                await context.sendDefer(true);
                const code = context.getOption<string>('background', false),
                    background = await bglist.find((b) => b.id === code?.toLowerCase());

                if (userData.backgrounds.includes(code)) {
                    context.sendReply({
                        content: t('commands:background.buy.alreadyOwned'),
                        flags: MessageFlags.EPHEMERAL
                    });

                    endCommand();
                    return;
                }
                const createProfile = new CreateProfile(t, context.author, userData, true, code);
                const profile = createProfile.create();
                const embed = createEmbed({
                    title: `${context.getEmojiById(bot.emotes.FOXY_YAY)} ${background.name}`,
                    description: background.description,
                    fields: [{
                        name: `${context.getEmojiById(bot.emotes.FOXY_DAILY)} ${t('commands:background.buy.price')}`,
                        value: `${background.cakes.toLocaleString(t.lng)} Cakes`,
                    }],
                    image: {
                        url: `attachment://background_preview_${context.author.id}.png`
                    }
                });

                context.sendReply({
                    embeds: [embed],
                    file: [{
                        name: `preview${context.author.id}.png`,
                        blob: await profile
                    }],
                    components: [createActionRow([createButton({
                        customId: createCustomId(0, context.author.id, context.commandId, code, background.cakes),
                        label: t('commands:background.buy.purchase'),
                        style: ButtonStyles.Success,
                        emoji: {
                            id: bot.emotes.FOXY_DAILY
                        }
                    })])]
                });

                endCommand();
                break;
            }

            case "masks": {
                await context.sendDefer(true);
                const code: string = context.getOption<string>("mask", false);
                const mask = masks.find(data => data.id === code?.toLowerCase());
                if (userData.masks.includes(code?.toLowerCase())) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:masks.alreadyOwned')),
                        flags: MessageFlags.EPHEMERAL
                    });

                    return endCommand();
                }

                const createProfile = new CreateProfile(t, context.author, userData, true, code, true);
                const profile = await createProfile.create();

                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:masks.preview')),
                    file: [{
                        name: 'profile.png',
                        blob: await profile
                    }],
                    flags: MessageFlags.EPHEMERAL,
                    components: [createActionRow([createButton({
                        customId: createCustomId(1, context.author.id, context.commandId, code, mask?.price, subCommand),
                        label: t('commands:masks.purchase'),
                        style: ButtonStyles.Success,
                        emoji: {
                            id: bot.emotes.FOXY_DAILY,
                        }
                    })])]
                });

                endCommand();
                break;
            }
        }
    }
});

export default StoreCommand;