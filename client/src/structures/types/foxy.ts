import { Bot, Collection } from 'discordeno';
import { ChatInputInteractionCommand } from './command';

export interface IdentifiedData<T> {
  id: number;
  data: T;
}

export interface FoxyClient extends Bot {
  commands: Collection<string, ChatInputInteractionCommand>;
  ownerId: bigint;
  clientId: bigint;
  username: string;
  isProduction: boolean;
  database: any;
  emotes: any;
  config: Object;
}