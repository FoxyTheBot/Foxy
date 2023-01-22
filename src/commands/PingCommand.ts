import { ApplicationCommandTypes, InteractionResponseTypes } from "discordeno/types";
import { createCommand } from "../structures/commands/CommandManager";

createCommand({
  name: "ping",
  description: "Ping the Bot!",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (client, interaction) => {
    await client.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `Pong!`,
        },
      },
    );
  },
});