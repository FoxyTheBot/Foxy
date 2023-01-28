import { CreateSlashApplicationCommand } from 'discordeno';
import ComponentInteractionContext from '../commands/ComponentInteractionContext';
import ChatInputInteractionContext from '../commands/ChatInputInteractionContext';

type CommandCategory = 'economy' | 'roleplay' | 'fun' | 'actions' | 'info' | 'social' | 'util';

export interface ChatInputCommandConfig extends CreateSlashApplicationCommand {
  devsOnly?: true;
  category: CommandCategory;
  authorDataFields: any;
}

export interface ChatInputInteractionCommand extends Readonly<ChatInputCommandConfig> {
  path: string;

  readonly execute: (
    ctx: ChatInputInteractionContext,
    finishCommand: (...args: unknown[]) => unknown,
    t: any,
  ) => Promise<unknown>;

  readonly commandRelatedExecutions?: ((
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: ComponentInteractionContext<any>,
  ) => Promise<unknown>)[];
}

export interface UsedCommandData {
  authorId: string;
  guildId: string;
  commandName: string;
  data: number;
  args: unknown[];
}