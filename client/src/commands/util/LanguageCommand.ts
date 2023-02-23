import { createCommand } from "../../structures/commands/createCommand";
import { createCustomId, createActionRow, createSelectMenu } from "../../utils/discord/Component";
import { bot } from "../../index";
import { MessageFlags } from "../../utils/discord/Message";
import ComponentInteractionContext from "structures/commands/ComponentInteractionContext";

const changeLanguage = async (context: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(context.user.id);
    const language = context.interaction.data.values[0];
    userData.language = language;
    await userData.save();

    await context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_YAY, bot.locale(`commands:lang.${language}`)),
        flags: MessageFlags.Ephemeral,
        components: [createActionRow([createSelectMenu({
            customId: createCustomId(0, context.user.id, context.commandId),
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
name: 'idioma',
    nameLocalizations: {
        'en-US': 'language'
    },
    description: "[🛠] Altere o idioma da Foxy",
    descriptionLocalizations: {
        "en-US": "[🛠] Change the Foxy's language"
    },
    category: 'social',
    commandRelatedExecutions: [changeLanguage],

    execute: async (context, endCommand, t) => {        
        context.sendReply({
            components: [createActionRow([createSelectMenu({
                customId: createCustomId(0, context.author.id, context.commandId),
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
            flags: MessageFlags.Ephemeral
        })

        endCommand();
    }
});

export default LanguageCommand;