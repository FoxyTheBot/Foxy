import { CreateSlashApplicationCommand } from 'discordeno';
import ComponentInteractionContext from '../../command/structures/ComponentInteractionContext';
import UnleashedCommandExecutor from '../../command/structures/UnleashedCommandExecutor';

type CommandCategory = 'economy' | 'roleplay' | 'fun' | 'actions' | 'social' | 'util' | 'games' | 'image' | 'dev' | 'mod';

export interface ChatInputCommandConfig extends CreateSlashApplicationCommand {
  // Will also be used as command name for subcommands to be used as legacy commands
  aliases?: string[];
  supportsLegacy?: boolean | false;
  devsOnly?: true;
  category: CommandCategory;
}

export interface CommandInterface extends Readonly<ChatInputCommandConfig> {
  readonly execute?: (
    context: UnleashedCommandExecutor,
    endCommand: (...args: unknown[]) => unknown,
    t: any,
    args?: string[],
  ) => Promise<unknown>;

  readonly commandRelatedExecutions?: ((
    context: ComponentInteractionContext<any>,
  ) => Promise<unknown>)[];
}