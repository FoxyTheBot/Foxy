import { bot } from "../../FoxyLauncher";
import { logger } from "../../utils/logger";
import config from '../../../config.json';

const updateApplicationCommands = async (): Promise<void> => {
    try {
        bot.helpers.upsertGlobalApplicationCommands(
            bot.commands.filter((command) => !command.devsOnly).array()
        );
        await bot.helpers.upsertGuildApplicationCommands(
            config.devGuildId,
            bot.commands
                .filter((command) => !!command.devsOnly)
                .array(),
        );
        logger.info('[READY] Slash Commands registered!');
    } catch (e) {
        logger.error('Error while registering commands', e);
    }
}

export { updateApplicationCommands };