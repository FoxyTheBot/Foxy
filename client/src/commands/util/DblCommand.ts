import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { getVotes } from "../../utils/dbl";

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

            case "top": {
                let data = await getVotes();
                data = data.sort((a, b) => b.quantity - a.quantity);
                const embed = createEmbed({
                    title: `<:topgg:1074823809376460923> **|** ${t('commands:upvote.top.title')}`,
                });

                let fields = embed.fields = [];
                for (let i in data) {
                    if (Number(i) > 14) break;
                    if (isNaN(data[i].quantity)) continue;

                    fields.push({
                        name: `${parseInt(data.map(m => m.id).indexOf(data[i].id))}º - \`${data[i].username}\``,
                        value: `**${parseInt(data[i].quantity)}** Votes`,
                        inline: true,
                    })
                }
            
                ctx.foxyReply({ embeds: [embed] });
                endCommand();
                break;
            }
        }
    }
});

export default DblCommand;