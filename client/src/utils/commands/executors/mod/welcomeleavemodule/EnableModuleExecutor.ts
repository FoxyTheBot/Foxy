import ComponentInteractionContext from "../../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../discord/Component";
import { createEmbed } from "../../../../discord/Embed";
import { MessageFlags } from "../../../../discord/Message";

const EnableModuleExecutor = async (context: ComponentInteractionContext) => {
    const guildInfo = await bot.database.getGuild(context.interaction.guildId);

    function updateMessage() {
        const embed = createEmbed({
            title: bot.locale('commands:WelcomeLeave.config.embed.title'),
            description: bot.locale('commands:WelcomeLeave.config.embed.description'),
            fields: [{
                name: bot.locale('commands:WelcomeLeave.config.embed.fields.isEnabled'),
                value: guildInfo.WelcomeModule.isEnabled ? bot.locale('commands:WelcomeLeave.config.embed.fields.isEnabledValue.true') : bot.locale('commands:WelcomeLeave.config.embed.fields.isEnabledValue.false')
            },
            {
                name: bot.locale('commands:WelcomeLeave.config.embed.fields.welcomeChannel'),
                value: guildInfo.WelcomeModule.welcomeChannel ? `<#${guildInfo.WelcomeModule.welcomeChannel}>` : bot.locale('commands:WelcomeLeave.config.embed.fields.welcomeChannelValue.none')
            },
            {
                name: bot.locale('commands:WelcomeLeave.config.embed.fields.leaveChannel'),
                value: guildInfo.WelcomeModule.leaveChannel ? `<#${guildInfo.WelcomeModule.leaveChannel}>` : bot.locale('commands:WelcomeLeave.config.embed.fields.leaveChannelValue.none')
            },
            {
                name: bot.locale('commands:WelcomeLeave.config.embed.fields.sendWelcomeDM'),
                value: guildInfo.WelcomeModule.sendDm ? bot.locale('commands:WelcomeLeave.config.embed.fields.sendWelcomeDMValue.true') : bot.locale('commands:WelcomeLeave.config.embed.fields.sendWelcomeDMValue.false')
            },
            {
                name: bot.locale('commands:WelcomeLeave.config.embed.fields.notificateWhenUserLeaves'),
                value: guildInfo.WelcomeModule.isLeaveMessageEnabled ? bot.locale('commands:WelcomeLeave.config.embed.fields.notificateWhenUserLeavesValue.true') : bot.locale('commands:WelcomeLeave.config.embed.fields.notificateWhenUserLeavesValue.false')
            }],
            footer: {
                text: bot.locale('commands:WelcomeLeave.config.embed.footer')
            }
        });

        const row = createActionRow([
            createButton({
                label: guildInfo.WelcomeModule.isEnabled ? bot.locale('commands:WelcomeLeave.config.embed.buttons.disable') : bot.locale('commands:WelcomeLeave.config.embed.buttons.enable'),
                style: guildInfo.WelcomeModule.isEnabled ? ButtonStyles.Danger : ButtonStyles.Success,
                customId: createCustomId(5, context.author.id, context.commandId)
            }),
            createButton({
                label: bot.locale('commands:WelcomeLeave.config.embed.buttons.setWelcomeMessage'),
                style: ButtonStyles.Primary,
                customId: createCustomId(6, context.author.id, context.commandId),
                disabled: !guildInfo.WelcomeModule.isEnabled
            }),
            createButton({
                label: bot.locale('commands:WelcomeLeave.config.embed.buttons.setLeaveMessage'),
                style: ButtonStyles.Primary,
                customId: createCustomId(7, context.author.id, context.commandId),
                disabled: !guildInfo.WelcomeModule.isEnabled
            }),
            createButton({
                label: guildInfo.WelcomeModule.isLeaveMessageEnabled ? bot.locale('commands:WelcomeLeave.config.embed.buttons.disableLeaveMessage') : bot.locale('commands:WelcomeLeave.config.embed.buttons.enableLeaveMessage'),
                style: guildInfo.WelcomeModule.isLeaveMessageEnabled ? ButtonStyles.Danger : ButtonStyles.Success,
                customId: createCustomId(8, context.author.id, context.commandId),
                disabled: !guildInfo.WelcomeModule.isEnabled
            }),
            createButton({
                label: guildInfo.WelcomeModule.sendDm ? bot.locale('commands:WelcomeLeave.config.embed.buttons.disableSendDm') : bot.locale('commands:WelcomeLeave.config.embed.buttons.enableSendDm'),
                style: guildInfo.WelcomeModule.sendDm ? ButtonStyles.Danger : ButtonStyles.Success,
                customId: createCustomId(9, context.author.id, context.commandId),
                disabled: !guildInfo.WelcomeModule.isEnabled
            }),
        ]);

        const row2 = createActionRow([createButton({
            label: bot.locale('commands:WelcomeLeave.config.embed.buttons.setDmMessage'),
            style: ButtonStyles.Primary,
            customId: createCustomId(10, context.author.id, context.commandId),
            disabled: !guildInfo.WelcomeModule.isEnabled
        }),
        createButton({
            label: bot.locale('commands:WelcomeLeave.config.embed.buttons.setWelcomeChannel'),
            style: ButtonStyles.Primary,
            customId: createCustomId(11, context.author.id, context.commandId),
            disabled: !guildInfo.WelcomeModule.isEnabled
        }),
        createButton({
            label: bot.locale('commands:WelcomeLeave.config.embed.buttons.setLeaveChannel'),
            style: ButtonStyles.Primary,
            customId: createCustomId(12, context.author.id, context.commandId),
            disabled: !guildInfo.WelcomeModule.isEnabled
        }),
        createButton({
            label: bot.locale('commands:WelcomeLeave.config.embed.buttons.reset'),
            style: ButtonStyles.Danger,
            customId: createCustomId(13, context.author.id, context.commandId),
        }),
        createButton({
            label: bot.locale('commands:WelcomeLeave.config.embed.buttons.save'),
            style: ButtonStyles.Success,
            customId: createCustomId(14, context.author.id, context.commandId),
        })
        ]);

        context.sendReply({
            embeds: [embed],
            components: [row, row2],
            flags: MessageFlags.EPHEMERAL
        });
    }


    if (guildInfo.WelcomeModule.isEnabled) {
        guildInfo.WelcomeModule.isEnabled = false;
        guildInfo.save();
        await updateMessage();
    } else {
        guildInfo.WelcomeModule.isEnabled = true;
        guildInfo.save();
        await updateMessage();
    }
}

export { EnableModuleExecutor }