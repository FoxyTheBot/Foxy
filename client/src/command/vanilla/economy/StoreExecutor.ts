import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { createEmbed } from "../../../utils/discord/Embed";
import { bot } from "../../../index";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import { bglist } from "../../../structures/json/backgroundList.json";
import { masks } from '../../../structures/json/layoutList.json'
import CreateProfile from '../../../utils/images/generators/GenerateProfile';
import { MessageFlags } from "../../../utils/discord/Message";

export default async function StoreExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const subCommand = context.getSubCommand();
        const userData = await bot.database.getUser(context.author.id);

        switch (subCommand) {
            case "backgrounds": {
                await context.sendDefer(true);
                const code = context.getOption<string>('background', false),
                    background = await bglist.find((b) => b.id === code?.toLowerCase());

                if (userData.userProfile.backgroundList.includes(code)) {
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
                        value: `${background.cakes.toLocaleString(t.lng || 'pt-BR')} Cakes`,
                    }],
                    image: {
                        url: `attachment://background_preview_${context.author.id}.png`
                    }
                });

                context.sendReply({
                    embeds: [embed],
                    file: [{
                        name: `background_preview_${context.author.id}.png`,
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

            case "avatar_decorations": {
                await context.sendDefer(true);
                const code: string = context.getOption<string>("avatar_decoration", false);
                const mask = masks.find(data => data.id === code?.toLowerCase());
                if (userData.userProfile.decorationList.includes(code?.toLowerCase())) {
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