import { Bot, Collection, User } from 'discordeno';
import { ChatInputInteractionCommand } from './command';
import { botHasGuildPermissions } from 'discordeno/permissions-plugin';
import { BotWithCache } from 'discordeno/cache-plugin';
export interface IdentifiedData<T> {
  id: number;
  data: T;
}

export interface FoxyClient extends BotWithCache<Bot> {
  commands: Collection<string, ChatInputInteractionCommand>;
  owner: User;
  clientId: bigint;
  username: string;
  isProduction: boolean;
  database: any;
  emotes: any;
  config: Object;
  locale: Function;
  isReady: boolean;
  hasGuildPermission: typeof botHasGuildPermissions;
}