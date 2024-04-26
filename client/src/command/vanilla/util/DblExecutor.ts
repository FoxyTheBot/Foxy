import { createEmbed } from "../../../utils/discord/Embed";
import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext"

export default async function DblExecutor(context: ChatInputInteractionContext, endCommand, t) {
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