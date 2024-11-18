import { User } from "discordeno/transformers";
import { logger } from "../../../../common/utils/logger";

const commandLogger = {
    commandLog: (command: string, author: User, guild: string, args: string, subcommands?: string): void => {
        logger.info("[COMMAND] |" +
            ` Command: ${command} |` +
            ` Subcommand: ${subcommands} |` +
            ` Author: ${author.username}#${author.discriminator} |` +
            ` AuthorId: ${author.id} |` +
            ` Guild: ${guild} |` +
            ` Args: ${args}`
        )
    }
}

export { commandLogger };