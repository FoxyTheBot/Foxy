import { Bot, Collection, User } from 'discordeno';
import { ChatInputInteractionCommand } from './command';

export interface IdentifiedData<T> {
  id: number;
  data: T;
}

export interface FoxyClient extends Bot {
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
}