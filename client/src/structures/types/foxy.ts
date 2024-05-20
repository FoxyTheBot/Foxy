import { Bot, Collection, User } from 'discordeno';
import { CommandInterface } from './command';
import { botHasGuildPermissions } from 'discordeno/permissions-plugin';
import { BotWithCache } from 'discordeno/cache-plugin';
import { FoxyRestManager } from '../../utils/RestManager';
import DatabaseConnection from '../database/DatabaseConnection';
import { colors } from './colors';
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
  emotes: any;
  config: Object;
  locale: Function;
  isReady: boolean;
  colors: typeof colors;
  hasGuildPermission: typeof botHasGuildPermissions;
  foxyRest: FoxyRestManager;
}