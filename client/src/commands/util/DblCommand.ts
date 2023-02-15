import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";

const DblCommand = createCommand({
    name: 'dbl',
    description: '[🛠] Vote Foxy on top.gg',
    descriptionLocalizations: {
        "pt-BR": '[🛠] Vote na Foxy no top.gg'
    },
    category: 'util', 
    options: [
        {
            name: "upvote",
            description: "[🛠] Vote for Foxy on top.gg",
            descriptionLocalizations: {
                "pt-BR": "[🛠] Vote na Foxy no top.gg"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        },
        {
            name: "top",
            description: "[🛠] See the top voters on top.gg",
            descriptionLocalizations: {
                "pt-BR": "[🛠] Veja os maiores votantes na top.gg"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        }
    ],

    execute: async (ctx, endCommand, t) => {
        switch (ctx.getSubCommand()) {
            case "upvote": {
                const embed = createEmbed({
                    description: t('commands:upvote.description')
                });
        
                ctx.foxyReply({ embeds: [embed] });
            
                endCommand();
                break;
            }
        }
    }
});

export default DblCommand;