import { createCommand } from '../../structures/commands/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { createActionRow, createSelectMenu, createCustomId } from '../../utils/discord/Component';
import { bglist } from "../../structures/json/backgroundList.json"
import { bot } from '../../index';
import { MessageFlags } from '../../utils/discord/Message';
import BackgroundSetExecutor from '../../utils/commands/executors/economy/BackgroundSetExecutor';
import { masks } from '../../structures/json/layoutList.json'
import { ButtonStyles } from 'discordeno/types';
import MaskSetExecutor from '../../utils/commands/executors/economy/MaskSetExecutor';

const ChangeCommand = createCommand({
    name: "change",
    nameLocalizations: {
        "pt-BR": "alterar"
    },
    description: "[Economy] Change your profile background or avatar decoration",
    descriptionLocalizations: {
        "pt-BR": "[Economia] Altere o background ou a decoração de avatar do seu perfil"
    },
    category: "economy",
    options: [{
        name: "background",
        description: "[Economy] Change your profile background",
        descriptionLocalizations: {
            "pt-BR": "[Economia] Altere o background do seu perfil"
        },
        type: ApplicationCommandOptionTypes.SubCommand
    },
    {
        name: "avatar_decoration",
        nameLocalizations: {
            'pt-BR': 'decoração_de_avatar'
        },
        description: '[Economy] Change your profile avatar decoration',
        descriptionLocalizations: {
            'pt-BR': '[Economia] Mude a decoração de avatar do seu perfil'
        },
        type: ApplicationCommandOptionTypes.SubCommand
    }],
    commandRelatedExecutions: [
        BackgroundSetExecutor, // 0
        MaskSetExecutor // 1
    ],

    async execute(context, endCommand, t) {
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
});

export default ChangeCommand;