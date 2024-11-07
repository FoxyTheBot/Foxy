import { bot } from "../../../../FoxyLauncher";
import { createCommand } from "../../../structures/createCommand";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import os from 'os';

const PingCommand = createCommand({
    name: "ping",
    description: "Checks the bot's latency.",
    category: "util",
    supportsSlash: false,
    supportsLegacy: true,
    
    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        const botReply = await context.sendMessageToChannel({ content: "Pinging..." });

        const ping = botReply.timestamp - context.message.timestamp;
        await context.editMessage({
            content: `🏓 **|** Pong! \n` +
            `⌚ **|** Latência da Mensagem: \`${ping}ms\`\n`+
            `💓 **|** Shard ${context.currentShard}`
        }, botReply.id);

        return endCommand();
    }
});

export default PingCommand;