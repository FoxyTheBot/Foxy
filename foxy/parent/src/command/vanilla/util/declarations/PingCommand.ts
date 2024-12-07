import { createCommand } from "../../../structures/createCommand";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import PingExecutor from "../PingExecutor";

const PingCommand = createCommand({
    name: "ping",
    description: "Checks the bot's latency.",
    category: "util",
    supportsSlash: false,
    supportsLegacy: true,

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        new PingExecutor().execute({ context, endCommand, t });
    }
});

export default PingCommand;