import { CreateSlashApplicationCommand } from 'discordeno';
import ComponentInteractionContext from '../commands/ComponentInteractionContext';
import ChatInputInteractionContext from '../commands/ChatInputInteractionContext';

type CommandCategory = 'economy' | 'roleplay' | 'fun' | 'actions' | 'social' | 'util' | 'games' | 'image' | 'dev' | 'mod';

export interface ChatInputCommandConfig extends CreateSlashApplicationCommand {
  devsOnly?: true;
  category: CommandCategory;
}

export interface ChatInputInteractionCommand extends Readonly<ChatInputCommandConfig> {
  readonly execute: (
    context: ChatInputInteractionContext,
    endCommand: (...args: unknown[]) => unknown,
    t: any,
  ) => Promise<unknown>;

  readonly commandRelatedExecutions?: ((
    context: ComponentInteractionContext<any>,
  ) => Promise<unknown>)[];
}