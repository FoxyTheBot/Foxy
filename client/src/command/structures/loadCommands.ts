import { ChatInputInteractionCommand } from '../../structures/types/command';
import { bot } from "../../FoxyLauncher";
import { resolve } from 'node:path';
import { logger } from '../../utils/logger';
import { updateApplicationCommands } from './updateApplicationCommands';
import * as fs from 'fs';

const loadCommands = async (): Promise<void> => {
  const commandFolders = await fs.readdirSync(resolve("build/src/command/vanilla"));
  for (const folder of commandFolders) {
    const commandFiles = await fs.readdirSync(resolve(`build/src/command/vanilla/${folder}/declarations`)).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = await import(resolve(`build/src/command/vanilla/${folder}/declarations/${file}`));
      const commandData = command.default as ChatInputInteractionCommand;
      try {
        bot.commands.set(commandData.name, commandData);
        bot.database.registerCommand(commandData.name, commandData.description)
      } catch (error) {
        logger.error(`Error loading command ${commandData.name}: ${error}`);
      }
    }
  }
  if (bot.commands.size > 0) {
    updateApplicationCommands();
  } else {
    logger.warn('No commands found');
  }
};


export { loadCommands };