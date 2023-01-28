import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "index";
import { createCommand } from "../../structures/commands/createCommand";

const AboutMeCommand = createCommand({
    path: '',
    name: "aboutme",
    description: "Defina o sobre mim do seu perfil",
    descriptionLocalizations: {
        "en-US": "Set your profile about me"
    },
    category: "social",
    options: [
        {
            name: "text",
            description: "O texto que você quer definir",
            descriptionLocalizations: {
                "en-US": "The text you want to set"
            },
            type: ApplicationCommandOptionTypes.String
        }
    ],
    authorDataFields: [],

    execute: async (ctx, finishCommand, t) => {
        const text = ctx.getOption<string>("text", false);
        const userData = await bot.database.getUser(ctx.author.id);

        if (text.length > 225) {
            ctx.foxyReply({ content: t("commands:aboutme.tooLong", { length: text.length.toString()}) });
            return finishCommand();
        }

        userData.aboutme = text;
        await userData.save();

        ctx.prettyResponse("✔", t("commands:aboutme.set", { aboutme: text }) );
    }
});