import { createCommand } from "../../structures/commands/createCommand";
import { createCustomId, createActionRow, createSelectMenu } from "../../utils/discord/Component";
import { bot } from "../../index";
import { MessageFlags } from "../../utils/discord/Message";
import ComponentInteractionContext from "structures/commands/ComponentInteractionContext";

const changeLanguage = async (ctx: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(ctx.user.id);
    const language = ctx.interaction.data.values[0];
    userData.language = language;
    await userData.save();

    await ctx.foxyReply({
        content: ctx.makeReply("🦊", bot.locale(`commands:lang.${language}`)),
        flags: MessageFlags.EPHEMERAL,
        components: [createActionRow([createSelectMenu({
            customId: createCustomId(0, ctx.user.id, ctx.commandId),
            disabled: true,
            options: [
                {
                    label: "Português do Brasil",
                    value: "pt-BR"
                },
                {
                    label: "English",
                    value: "en-US"
                }
            ]
            
        })])]
    });
}

const LanguageCommand = createCommand({
    path: '',
    name: 'idioma',
    nameLocalizations: {
        'en-US': 'language'
    },
    description: "Altere o idioma da Foxy",
    descriptionLocalizations: {
        "en-US": "Change the Foxy's language"
    },
    category: 'social',
    authorDataFields: [],
    commandRelatedExecutions: [changeLanguage],

    execute: async (ctx, finishCommand, t) => {        
        ctx.foxyReply({
            components: [createActionRow([createSelectMenu({
                customId: createCustomId(0, ctx.author.id, ctx.commandId),
                placeholder: "Select a language",
                options: [
                    {
                        label: "Português do Brasil",
                        value: "pt-BR"
                    },
                    {
                        label: "English",
                        value: "en-US"
                    }
                ]
            })])],
            flags: MessageFlags.EPHEMERAL
        })

        finishCommand();
    }
});

export default LanguageCommand;