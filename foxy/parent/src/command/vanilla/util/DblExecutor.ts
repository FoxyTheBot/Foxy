import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class DblExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const embed = createEmbed({
            description: t('commands:upvote.description')
        });

        context.reply({ embeds: [embed] });

        return endCommand();
    }
}