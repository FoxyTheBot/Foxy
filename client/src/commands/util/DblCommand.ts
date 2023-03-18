import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";

const DblCommand = createCommand({
    name: 'dbl',
    description: '[Utils] Vote Foxy on top.gg',
    descriptionLocalizations: {
        "pt-BR": '[Utils] Vote na Foxy no top.gg'
    },
    category: 'util',
    options: [
        {
            name: "upvote",
            description: "[Utils] Vote for Foxy on top.gg",
            descriptionLocalizations: {
                "pt-BR": "[Utils] Vote na Foxy no top.gg"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        }
    ],

    execute: async (context, endCommand, t) => {
        switch (context.getSubCommand()) {
            case "upvote": {
                const embed = createEmbed({
                    description: t('commands:upvote.description')
                });

                context.sendReply({ embeds: [embed] });

                endCommand();
                break;
            }
        }
    }
});

export default DblCommand;