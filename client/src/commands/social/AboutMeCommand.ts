import { ApplicationCommandOptionTypes } from "discordeno/types";
import { MessageFlags } from "../../utils/discord/Message";
import { bot } from "../../index";
import { createCommand } from "../../structures/commands/createCommand";

const AboutMeCommand = createCommand({
name: "sobremim",
    nameLocalizations: {
        "en-US": "aboutme"
    },
    description: "[Social] Defina o sobre mim do seu perfil",
    descriptionLocalizations: {
        "en-US": "[Social] Set your profile about me"
    },
    category: "social",
    options: [
        {
            name: "text",
            nameLocalizations: {
                'pt-BR': 'texto',
            },
            description: "O texto que você quer definir",
            descriptionLocalizations: {
                "en-US": "The text you want to set"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        const text = context.getOption<string>("text", false);
        const userData = await bot.database.getUser(context.author.id);

        if (text.length > 225) {
            context.sendReply({ content: t("commands:aboutme.tooLong", { length: text.length.toString() }) });
            return endCommand();
        }

        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:aboutme.set", { aboutme: text })),
            flags: MessageFlags.Ephemeral
        })
        userData.aboutme = text;
        await userData.save();
        endCommand();
    }
});

export default AboutMeCommand;