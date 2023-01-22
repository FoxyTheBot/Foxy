import client from "../../FoxyClient";
import { Command } from "../types/Command";
import config from "../../../config.json";  

export function createCommand(command: Command) {
    client.commands.set(command.name, command);
}

export async function updateApplicationCommands() {
    console.info("[COMMANDS] - Updating application commands...");
    await client.helpers.upsertGlobalApplicationCommands(
        client.commands
            .filter((command) => !command.devOnly)
            .array(),
    );
    console.info("[COMMANDS] - Updating developer commands");

    await client.helpers.upsertGuildApplicationCommands(
        config.devGuildId,
        client.commands
          .filter((command) => !!command.devOnly)
          .array(),
      );

}