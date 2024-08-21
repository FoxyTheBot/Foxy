import { Bot, Collection, User, createRestManager } from 'discordeno';
import { CommandInterface } from './CommandInterfaces';
import { botHasGuildPermissions } from 'discordeno/permissions-plugin';
import { BotWithCache } from 'discordeno/cache-plugin';
import DatabaseConnection from '../database/DatabaseConnection';
import { colors } from '../../utils/colors';
import { FoxyRestManager } from '../../utils/RestManager';
import { emotes } from '../../utils/emotes';
export interface IdentifiedData<T> {
  id: number;
  data: T;
}

export interface FoxyClient extends BotWithCache<Bot> {
  commands: Collection<string, CommandInterface>;
  owner: User;
  clientId: bigint;
  username: string;
  isProduction: boolean;
  database: DatabaseConnection;
  emotes: typeof emotes;
  colors: typeof colors;
  config: Object;
  locale: Function;
  isReady: boolean;
  hasGuildPermission: typeof botHasGuildPermissions;
  rest: Rest;
}

export interface Rest extends ReturnType<typeof createRestManager> {
  foxy: FoxyRestManager;
}