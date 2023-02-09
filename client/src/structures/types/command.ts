import { CreateSlashApplicationCommand } from 'discordeno';
import ComponentInteractionContext from '../commands/ComponentInteractionContext';
import ChatInputInteractionContext from '../commands/ChatInputInteractionContext';

type CommandCategory = 'economy' | 'roleplay' | 'fun' | 'actions' | 'social' | 'util' | 'games';

export interface ChatInputCommandConfig extends CreateSlashApplicationCommand {
  devsOnly?: true;
  category: CommandCategory;
}

export interface ChatInputInteractionCommand extends Readonly<ChatInputCommandConfig> {
  readonly execute: (
    ctx: ChatInputInteractionContext,
    endCommand: (...args: unknown[]) => unknown,
    t: any,
  ) => Promise<unknown>;

  readonly commandRelatedExecutions?: ((
    ctx: ComponentInteractionContext<any>,
  ) => Promise<unknown>)[];
}