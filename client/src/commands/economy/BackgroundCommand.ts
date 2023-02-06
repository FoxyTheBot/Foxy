import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { createEmbed } from '../../utils/discord/Embed';
import { createActionRow, createSelectMenu, createCustomId } from '../../utils/discord/Component';
import { bglist } from "../../structures/json/backgroundList.json"
import GenerateImage from '../../structures/GenerateImage';
import { bot } from '../../index';
import executeBackgroundSet from '../../structures/commands/modules/executeBackgroundSet';

const BackgroundCommand = createCommand({
    path: '',
    name: 'background',
    description: 'Mude o background do seu perfil',
    descriptionLocalizations: {
        'en-US': 'Change your profile background'
    },
    category: 'economy',
    options: [
        {
            name: "set",
            nameLocalizations: {
                "pt-BR": "definir"
            },
            description: "Defina o background do seu perfil",
            descriptionLocalizations: {
                "en-US": "Set your profile background"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
        }
    ],

    authorDataFields: [],
    commandRelatedExecutions: [executeBackgroundSet],
    execute: async (ctx, finishCommand, t) => {
        const subcommand = ctx.getSubCommand();
        const userData = await bot.database.getUser(ctx.author.id);
        switch(subcommand) {
            case "buy": {
                const code = ctx.getOption<string>("background", false),
                background = await bglist.find((b) => b.id === code?.toLowerCase());
                ctx.defer(true);

                if (userData.backgrounds.includes(code)) {
                    ctx.foxyReply({
                        content: ctx.makeReply(bot.emotes.error, t('commands:background.buy.alreadyOwned'))
                    })
                    return finishCommand();
                }

                const embed = createEmbed({
                    title: background.name,
                    description: background.description,
                    fields: [
                        {
                            name: t('commands:background.buy.price'),
                            value: `${background.foxcoins} Paws`,
                            inline: true
                        }
                    ]
                });

                ctx.foxyReply({
                    embeds: [embed],
                })

                const canvasGenerator = new GenerateImage(t, ctx.author, 1436, 884, true, code);

                ctx.foxyReply({
                    content: t('commands:background.buy.preview'),
                    file: {
                        name: 'preview.png',
                        blob: await canvasGenerator.renderProfile()
                    }
                })
                finishCommand();
                break;
            }

            case "set": {
                await ctx.defer(true);
                const fetchBackgrounds = userData.backgrounds;
                const backgrounds = await bglist.filter((b) => fetchBackgrounds.includes(b.id));
                ctx.foxyReply({
                    content: t('commands:background.set.select'),
                    components: [createActionRow([createSelectMenu({
                        customId: createCustomId(0, ctx.author.id, "background"),
                        placeholder: t('commands:background.set.select'),
                        options: backgrounds.map((b) => Object({
                            name: b.name,
                            value: b.id,
                        }))
                    })])]
                });
                finishCommand();
                break;
            }
        }
    }
});

export default BackgroundCommand;