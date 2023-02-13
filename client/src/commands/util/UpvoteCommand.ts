import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";

const UpvoteCommand = createCommand({
    name: 'upvote',
    description: '[🛠] Vote Foxy on top.gg',
    descriptionLocalizations: {
        "pt-BR": '[🛠] Vote na Foxy no top.gg'
    },
    category: 'util',   
    execute: async (ctx, endCommand, t) => {
        const embed = createEmbed({
            description: t('commands:upvote.description')
        });

        ctx.foxyReply({ embeds: [embed] });
    
        endCommand();
    }
});

export default UpvoteCommand;