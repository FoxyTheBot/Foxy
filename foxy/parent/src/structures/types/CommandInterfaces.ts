import { ApplicationCommandTypes, CreateSlashApplicationCommand } from 'discordeno';
import ComponentInteractionContext from '../../command/structures/ComponentInteractionContext';
import UnleashedCommandExecutor from '../../command/structures/UnleashedCommandExecutor';
import { TFunction } from 'i18next';

type CommandCategory = 'economy' | 'roleplay' | 'fun' | 'actions' | 'social' | 'util' | 'games' | 'image' | 'dev' | 'mod';

export interface ChatInputCommandConfig extends CreateSlashApplicationCommand {
  // Will also be used as command name for subcommands to be used as legacy commands
  type?: ApplicationCommandTypes | ApplicationCommandTypes.ChatInput;
  aliases?: string[];
  supportsLegacy?: boolean | false;
  supportsSlash?: boolean | true;
  devsOnly?: true;
  category: CommandCategory;
  integrationTypes?: IntegrationTypes[];
  contexts?: IntegrationContexts[];
}

export enum IntegrationTypes {
  GUILD_INSTALL = 0,
  USER_INSTALL = 1,
}

export enum IntegrationContexts {
  GUILD = 0,
  BOT_DM = 1,
  PRIVATE_CHANNEL = 3
}

export interface CommandInterface extends Readonly<ChatInputCommandConfig> {
  readonly execute?: (
    context: UnleashedCommandExecutor,
    endCommand: (...args: unknown[]) => unknown,
    t: TFunction & { lng: string },
    args?: string[],
  ) => Promise<unknown>;

  readonly commandRelatedExecutions?: ((
    context: ComponentInteractionContext<any>,
  ) => Promise<unknown>)[];
}