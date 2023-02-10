import { ApplicationCommandOptionTypes } from "discordeno/types";
import { MessageFlags } from "../../utils/discord/Message";
import { bot } from "../../index";
import { createCommand } from "../../structures/commands/createCommand";

const AboutMeCommand = createCommand({
name: "sobremim",
    nameLocalizations: {
        "en-US": "aboutme"
    },
    description: "[👥] Defina o sobre mim do seu perfil",
    descriptionLocalizations: {
        "en-US": "[👥] Set your profile about me"
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

    execute: async (ctx, endCommand, t) => {
        const text = ctx.getOption<string>("text", false);
        const userData = await bot.database.getUser(ctx.author.id);

        if (text.length > 225) {
            ctx.foxyReply({ content: t("commands:aboutme.tooLong", { length: text.length.toString() }) });
            return endCommand();
        }

        ctx.foxyReply({
            content: ctx.makeReply("✔", t("commands:aboutme.set", { aboutme: text })),
            flags: MessageFlags.Ephemeral
        })
        userData.aboutme = text;
        await userData.save();
        endCommand();
    }
});

export default AboutMeCommand;