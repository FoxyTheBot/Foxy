import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { languages } from '../../../../structures/json/languages.json';
import LanguageExecutor from "../LanguageExecutor";

const avaliableLanguages = languages.map(language => Object({ name: language.name, nameLocalizations: language.nameLocalizations, value: language.value }));

const LanguageCommand = createCommand({
    name: 'language',
    nameLocalizations: {
        'pt-BR': 'idioma'
    },
    description: "[Utils] Change the Foxy's language",
    descriptionLocalizations: {
        "pt-BR": "[Utilitários] Altere o idioma da Foxy"
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
                "pt-BR": "O idioma para o qual você quer mudar"
            },
            required: true,
            type: ApplicationCommandOptionTypes.String,
            choices: avaliableLanguages
        },
    ],
    execute: async (context, endCommand, t) => {
      LanguageExecutor(context, endCommand, t);
    }
});

export default LanguageCommand;