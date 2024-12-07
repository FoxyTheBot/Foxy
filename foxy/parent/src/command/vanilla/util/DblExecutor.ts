import { createEmbed } from "../../../utils/discord/Embed";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class DblExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const embed = createEmbed({
            description: t('commands:upvote.description')
        });

        context.reply({ embeds: [embed] });

        return endCommand();
    }
}