import { BotClient } from "../../FoxyClient";
import { ApplicationCommandOption, ApplicationCommandTypes, Interaction } from "discordeno";

export interface Command {
  name: string;
  description: string;
  type: ApplicationCommandTypes;
  devOnly?: boolean;
  options?: ApplicationCommandOption[];
  execute: (bot: BotClient, interaction: Interaction) => unknown;
}