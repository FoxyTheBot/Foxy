import { createCommand } from "../../structures/commands/createCommand";
import { MessageFlags } from "../../utils/discord/Message";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../..";

const LanguageCommand = createCommand({
    name: 'language',
    nameLocalizations: {
        'pt-BR': 'idioma'
    },
    description: "[Utils] Change the Foxy's language",
    descriptionLocalizations: {
        "pt-BR": "[Utils] Altere o idioma da Foxy"
    },
    category: 'util',
    options: [
        {
            name: "language",
            nameLocalizations: {
                "pt-BR": "idioma"   
            },
            description: "The language you want to change to",
            descriptionLocalizations: {
                "pt-BR": "O idioma que você quer mudar"
            },
            required: true, 
            type: ApplicationCommandOptionTypes.String,
            choices: [
                {
                    name: "Português do Brasil",
                    nameLocalizations: {
                        "en-US": "Portuguese (Brazil)"
                    },
                    value: "pt-BR"
                },
                {
                    name: "English",
                    nameLocalizations: {
                        "pt-BR": "Inglês"
                    },
                    value: "en-US"
                }
            ],
        },
    ],
    execute: async (context, endCommand, t) => {
        const language = context.getOption<string>('language', false);
        const userData = await bot.database.getUser(context.author.id);
        userData.language = language;
        await userData.save();
        
        context.sendReply({
            content: t(`commands:lang.${language}`),
            flags: MessageFlags.Ephemeral
        })

        endCommand();
    }
});

export default LanguageCommand;