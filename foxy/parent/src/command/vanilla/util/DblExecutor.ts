import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class DblExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        switch (context.getSubCommand()) {
            case "upvote": {
                const embed = createEmbed({
                    description: t('commands:upvote.description')
                });

                context.reply({ embeds: [embed] });

                endCommand();
                break;
            }
        }
    }
}