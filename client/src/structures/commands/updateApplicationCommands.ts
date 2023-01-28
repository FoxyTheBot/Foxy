import { bot } from "../../index";
import { CreateSlashApplicationCommand } from "discordeno/types";
import { logger } from "../../utils/logger";

const updateApplicationCommands = async (): Promise<void> => {
    try {
        const allCommands = bot.commands.reduce<CreateSlashApplicationCommand[]>((p, c) => {
            if (c.devsOnly) return p;
    
            p.push({
                name: c.name,
                description: c.description,
                options: c.options,
                nameLocalizations: c.nameLocalizations,
                descriptionLocalizations: c.descriptionLocalizations,
                dmPermission: false,
            });
            return p;
        }, []);
        await bot.helpers.upsertGlobalApplicationCommands(allCommands);
        logger.success(`Loaded ${allCommands.length} commands`)
    
    } catch (e) {
        logger.error('Error while registering commands', e);
    }
}

export { updateApplicationCommands };