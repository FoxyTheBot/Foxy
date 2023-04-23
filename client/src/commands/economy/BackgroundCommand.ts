import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes, ButtonStyles } from 'discordeno/types';
import { createActionRow, createSelectMenu, createCustomId, createButton } from '../../utils/discord/Component';
import { bglist } from "../../structures/json/backgroundList.json"
import { bot } from '../../index';
import BackgroundBuyExecutor from '../../utils/commands/executors/economy/BackgroundBuyExecutor';
import { MessageFlags } from '../../utils/discord/Message';
import CreateProfile from '../../utils/commands/generators/GenerateProfile';
import BackgroundSetExecutor from '../../utils/commands/executors/economy/BackgroundSetExecutor';
import { createEmbed } from '../../utils/discord/Embed';

var choices = [];

for (var i = 0; i < bglist.length; i++) {
    if (bglist[i].cakes === 0) continue;
    choices.push({
        name: `💖 ${bglist[i].name} - ${bglist[i].cakes} Cakes`,
        value: bglist[i].id
    })
}

const BackgroundCommand = createCommand({
    name: 'background',
    description: '[Economy] Change your profile background',
    descriptionLocalizations: {
        'pt-BR': '[Economia] Mude o background do seu perfil'
    },
    category: 'economy',
    options: [
        {
            name: "set",
            nameLocalizations: {
                "pt-BR": "definir"
            },
            description: "[Economy] Set your profile background",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Defina o background do seu perfil"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
            name: "buy",
            nameLocalizations: {
                "pt-BR": "comprar"
            },
            description: "[Economy] Buy a background",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Compre um background"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "background",
                    description: "Select the background you want to buy",
                    descriptionLocalizations: {
                        "pt-BR": "Selecione o background que deseja comprar"
                    },
                    type: ApplicationCommandOptionTypes.String,
                    required: true,
                    choices: choices
                }
            ]
        }
    ],

    commandRelatedExecutions: [BackgroundBuyExecutor, BackgroundSetExecutor],
    execute: async (context, endCommand, t) => {
        const subcommand = context.getSubCommand();
        const userData = await bot.database.getUser(context.author.id);
        switch (subcommand) {
            case 'buy': {
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
                        value: `${background.cakes} Cakes`,
                    }],
                    image: {
                        url: `attachment://preview${context.author.id}.png`
                    }
                });

                context.sendReply({
                    embeds: [embed],
                    file: [{
                        name: `preview${context.author.id}.png`,
                        blob: await profile
                    }],
                    components: [createActionRow([createButton({
                        customId: createCustomId(0, context.author.id, context.commandId, code, background.cakes, subcommand),
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
            case "set": {
                await context.sendDefer(true);
                const fetchBackgrounds = userData.backgrounds;
                const backgrounds = await bglist.filter((b) => fetchBackgrounds.includes(b.id));

                context.sendReply({
                    components: [createActionRow([createSelectMenu({
                        customId: createCustomId(1, context.author.id, context.commandId, subcommand),
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
        }
    }
});

export default BackgroundCommand;