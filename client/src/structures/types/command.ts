import { CreateSlashApplicationCommand } from 'discordeno';
import ComponentInteractionContext from '../../command/structures/ComponentInteractionContext';
import ChatInputInteractionContext from '../../command/structures/ChatInputInteractionContext';
import ChatInputMessageContext from '../../command/structures/ChatInputMessageContext';

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

  readonly executeAsLegacy?: (
    message: ChatInputMessageContext,
    args: string[],
    t: any,
  ) => Promise<unknown>;
}